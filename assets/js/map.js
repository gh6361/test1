// Import the combined locations array from your hub file
import { locations } from "../data/index.js";

window.addEventListener("load", () => {
  const mapEl = document.getElementById("map");
  const panel = document.getElementById("location-panel");

  // PREVENT DOUBLE INITIALIZATION ERROR
  if (mapEl && mapEl._leaflet_id) {
    return;
  }

  // Standard Gallery Lightbox Elements
  const galOverlay = document.getElementById("lightbox");
  const galImageA = document.getElementById("lightbox-image-a");
  const galImageB = document.getElementById("lightbox-image-b");
  const galClose = document.getElementById("lightbox-close");
  const galPrev = document.getElementById("lightbox-prev");
  const galNext = document.getElementById("lightbox-next");
  const galCaption = document.getElementById("lightbox-caption");

  // --- OPT: cache DOM lookups that were previously re-queried on every
  // gallery render / resize event. These elements are static, so we only
  // need to find them once. ---
  const lightboxDescWrapper = document.querySelector(".lightbox-desc-wrapper");
  const lightboxCenterGroup = document.querySelector(".lightbox-center-group");
  const siteNavEl = document.querySelector(".editorial-header");
  let lightboxCounterEl = document.getElementById("lightbox-global-counter");

  // --- OPT: cache computed image aspect ratios so we don't spin up a new
  // Image() object and recompute naturalWidth/naturalHeight every time
  // alignCaptionToImageTop runs (it runs on every image swap AND on every
  // resize event). ---
  const imageRatioCache = new Map();

  // --- OPT: small rAF-based debounce so rapid-fire resize events collapse
  // into a single layout pass per frame instead of one per event. ---
  function rafDebounce(fn) {
    let scheduled = false;
    return function (...args) {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        fn.apply(this, args);
      });
    };
  }

  let galImages = [];
  let galCurrentIndex = 0;
  let galActive = galImageA;
  let galInactive = galImageB;
  let galleryTopGapLock = null; // <-- Stores the calculated gap for the whole stack
  let galleryResizeObserver = null; // <-- Tracks image area

  if (!mapEl || !panel || typeof L === "undefined") return;

  // Define coordinate boundaries FIRST so the map can use them to load
  const regionBounds = {
    world: [
      [-55, -170], // Western edge (Keeps North America in frame)
      [75, 180],
    ],
    europe: [
      [38, -10],
      [69, 35],
    ],
    na: [
      [22, -175],
      [70, -45],
    ],
    oceania: [
      [-47, 110],
      [-10, 180],
    ],
  };

  // --- Vertical-Only Limits ---
  const verticalBounds = [
    [-90, -10000],
    [90, 10000],
  ];

  // --- CHECK URL BEFORE INITIALIZING MAP ---
  const urlParams = new URLSearchParams(window.location.search);
  let startCenter = null;
  let startZoom = null;

  if (urlParams.has("loc")) {
    const locIdx = parseInt(urlParams.get("loc"), 10);
    if (!isNaN(locIdx) && locations[locIdx]) {
      startCenter = locations[locIdx].coords;
      startZoom = 6; // Instantly start zoomed in!
    }
  } else if (urlParams.has("lat") && urlParams.has("lng")) {
    startCenter = [
      parseFloat(urlParams.get("lat")),
      parseFloat(urlParams.get("lng")),
    ];
    startZoom = urlParams.has("zoom") ? parseInt(urlParams.get("zoom"), 10) : 6;
  }

  const map = L.map(mapEl, {
    zoomControl: false,
    zoomSnap: 0.1,
    wheelPxPerZoomLevel: 100,
    minZoom: 1.8,
    maxBounds: verticalBounds,
    maxBoundsViscosity: 1.0,
    worldCopyJump: true,
  });

  // force Leaflet to re-measure the container immediately
  map.invalidateSize();

  if (startCenter && startZoom) {
    map.setView(startCenter, startZoom);
  } else {
    map.fitBounds(regionBounds.world);
  }

  // Manually add the zoom control to the bottom right
  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(map);

  // Moody, Dark Slate Theme (Carto Dark Matter)
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Set region control back to topright
  const regionControl = L.control({ position: "topright" });

  regionControl.onAdd = function (mapInstance) {
    const div = L.DomUtil.create("div", "map-region-controls");

    div.innerHTML = `
      <button type="button" data-region="world">World</button>
      <button type="button" data-region="europe">Europe</button>
      <button type="button" data-region="na">US & Canada</button>
      <button type="button" data-region="oceania">Australia & NZ</button>
    `;

    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    // Tracker to remember what button you clicked last (defaults to world)
    let lastRegion = "world";

    const buttons = div.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const targetRegion = e.target.dataset.region;

        if (regionBounds[targetRegion]) {
          const currentZoom = mapInstance.getZoom();

          // Determine if the user is manually zoomed in or clicked an index pin (zoom > 4)
          const isZoomedIn = currentZoom > 4;

          // Determine if we are moving to or from the World view
          const isWorldTransition =
            lastRegion === "world" || targetRegion === "world";

          if (isZoomedIn || !isWorldTransition) {
            // INSTANT JUMP: If already zoomed in OR moving Region-to-Region
            mapInstance.fitBounds(regionBounds[targetRegion], {
              animate: false,
              padding: [20, 20],
            });
          } else {
            // SMOOTH FLIGHT: Only if zoomed out AND transitioning between World <-> Region
            mapInstance.flyToBounds(regionBounds[targetRegion], {
              duration: 0.7,
              padding: [20, 20],
            });
          }

          // Update the tracker so it remembers where you are for the next click
          lastRegion = targetRegion;
        }
      });
    });

    return div;
  };

  regionControl.addTo(map);

  function swapGalImages() {
    [galActive, galInactive] = [galInactive, galActive];
  }

  // --- OPT: helper that centralizes the target-zoom math shared by the
  // sidebar-link click handler and the URL-param routing block below
  // (previously duplicated verbatim in two places). ---
  function computeTargetZoomForMarker(targetMarker) {
    let targetZoom = 6;
    const visibleParent = markers.getVisibleParent(targetMarker);

    if (visibleParent && visibleParent !== targetMarker) {
      if (
        targetMarker.__parent &&
        typeof targetMarker.__parent._zoom === "number"
      ) {
        const breakZoom = targetMarker.__parent._zoom + 1;
        targetZoom = Math.min(breakZoom, 15);
      } else {
        targetZoom = 15;
      }
    }
    if (targetZoom < 6) targetZoom = 6;
    return targetZoom;
  }

  function renderGalImage(index) {
    if (!galImages.length || !galInactive || !galActive) return;
    galCurrentIndex = (index + galImages.length) % galImages.length;

    const image = galImages[galCurrentIndex];

    // 1. Tell the browser exactly what to do WHEN the download finishes FIRST
    galInactive.onload = () => {
      // OPT: reuse cached references instead of re-querying the DOM every call
      const descWrapper = lightboxDescWrapper;
      const centerGroup = lightboxCenterGroup;

      if (!lightboxCounterEl && galOverlay) {
        lightboxCounterEl = document.createElement("div");
        lightboxCounterEl.id = "lightbox-global-counter";
        galOverlay.appendChild(lightboxCounterEl);
      }
      const counterEl = lightboxCounterEl;

      if (galImages.length <= 1) {
        if (descWrapper) descWrapper.style.display = "none";
        if (counterEl) counterEl.style.display = "none";
        if (galCaption) galCaption.innerHTML = "";
      } else {
        if (descWrapper) descWrapper.style.display = "";

        if (counterEl) {
          counterEl.style.display = "block";
          counterEl.innerHTML = `${galCurrentIndex + 1} / ${galImages.length}`;
        }

        const hasDesc = !!image.detailedDescription;
        const hasCol = image.collections && image.collections.length > 0;

        // The layout shifts *only* after the new image is ready
        if (!hasDesc && !hasCol) {
          if (descWrapper) descWrapper.classList.add("caption-collapsed");
          if (centerGroup) centerGroup.classList.add("no-caption");
          if (galCaption) galCaption.innerHTML = "";
        } else {
          if (descWrapper) descWrapper.classList.remove("caption-collapsed");
          if (centerGroup) centerGroup.classList.remove("no-caption");

          let collectionsHTML = "";
          if (hasCol) {
            const links = image.collections
              .map((c) => `<a href="${c.url}">${c.name}</a>`)
              .join(", ");
            collectionsHTML = `In collections: ${links}`;
          }

          if (galCaption) {
            galCaption.innerHTML = `
              ${hasDesc ? `<div class="caption-details">${image.detailedDescription}</div>` : ""}
              ${collectionsHTML ? `<div class="caption-collections">${collectionsHTML}</div>` : ""}
            `;
          }
        }
      }

      galOverlay.classList.remove("hidden");

      // Trigger the opacity crossfade
      requestAnimationFrame(() => {
        galActive.classList.remove("active");
        galInactive.classList.add("active");
        swapGalImages();

        const thumbs = document.querySelectorAll(".lb-thumb");
        if (thumbs.length > 0) {
          thumbs.forEach((t) => t.classList.remove("active"));
          const activeThumb = document.querySelector(
            `.lb-thumb[data-index="${galCurrentIndex}"]`,
          );
          if (activeThumb) activeThumb.classList.add("active");
        }

        // A tiny 50ms delay ensures the browser has painted the image's new dimensions
        setTimeout(alignCaptionToImageTop, 50);
      });
    };

    // 2. Trigger the download SECOND.
    // Clearing the src first forces the browser to reliably fire the onload event.
    galInactive.src = "";
    galInactive.src = image.src;
    galInactive.alt = image.caption || `Image ${galCurrentIndex + 1}`;
  }

  function openGalleryLightbox(images, startIndex) {
    if (!galOverlay) return;
    galImages = images;

    // --- HIDE THE NAVBAR ---
    if (siteNavEl) siteNavEl.style.display = "none";

    const thumbContainer = document.getElementById("lightbox-thumbnails");

    // Set single-mode if needed
    if (images.length <= 1) {
      galOverlay.classList.add("single-mode");
      galOverlay.classList.remove("has-thumbnails");
      if (thumbContainer) thumbContainer.innerHTML = "";
    } else {
      galOverlay.classList.remove("single-mode");

      // --- Generate Thumbnails ---
      galOverlay.classList.add("has-thumbnails");
      if (thumbContainer) {
        // OPT: build via array + join instead of repeated string concatenation
        const thumbHtml = images.map(
          (img, idx) =>
            `<img src="${img.src}" class="lb-thumb ${idx === (startIndex || 0) ? "active" : ""}" data-index="${idx}" alt="thumbnail">`,
        );
        thumbContainer.innerHTML = thumbHtml.join("");

        // OPT: single delegated listener instead of one per thumbnail
        thumbContainer.addEventListener(
          "click",
          (e) => {
            const thumbEl = e.target.closest(".lb-thumb");
            if (!thumbEl) return;
            const clickedIdx = parseInt(thumbEl.dataset.index, 10);
            renderGalImage(clickedIdx);
          },
          { once: false },
        );
      }
    }

    galOverlay.classList.remove("hidden");
    renderGalImage(startIndex || 0);
  }

  function closeGalleryLightbox() {
    if (!galOverlay) return;
    galOverlay.classList.add("hidden");
    galOverlay.classList.remove("single-mode");

    if (galImageA) galImageA.src = "";
    if (galImageB) galImageB.src = "";
    if (galCaption) galCaption.textContent = "";
    galImages = [];

    galleryTopGapLock = null; // Reset the lock for the next location!

    // --- BRING THE NAVBAR BACK ---
    if (siteNavEl) siteNavEl.style.display = "";
  }

  function nextGalImage() {
    if (galImages.length <= 1) return;
    renderGalImage(galCurrentIndex + 1);
  }

  function prevGalImage() {
    if (galImages.length <= 1) return;
    renderGalImage(galCurrentIndex - 1);
  }

  function renderDefaultPanel() {
    // 1. Group locations by Country AND State
    const groupedLocations = {};

    locations.forEach((loc, index) => {
      const country = loc.country || "Other";
      const state = loc.state || "NONE";

      const displayName = loc.name.includes(":")
        ? loc.name.split(":")[0].trim()
        : loc.name;

      if (!groupedLocations[country]) {
        groupedLocations[country] = {};
      }
      if (!groupedLocations[country][state]) {
        groupedLocations[country][state] = [];
      }

      groupedLocations[country][state].push({
        displayName: displayName,
        originalIndex: index,
      });
    });

    // 2. Sort the countries alphabetically
    const sortedCountries = Object.keys(groupedLocations).sort((a, b) =>
      a.localeCompare(b),
    );

    // 3. Generate the grouped HTML list
    // OPT: accumulate into an array and join once at the end instead of
    // repeated += string concatenation (avoids intermediate string copies).
    const htmlParts = [];

    sortedCountries.forEach((country) => {
      const displayCountry =
        country.toUpperCase() === "UNITED STATES" ||
        country.toUpperCase() === "U.S."
          ? "UNITED STATES"
          : country;

      htmlParts.push(`
        <li>
          <div style="
            font-family: var(--font-sans); 
            font-size: 0.75rem; 
            color: var(--text-body); 
            text-transform: uppercase; 
            letter-spacing: 0.15em; 
            margin-top: 0.9rem;
            margin-bottom: 1.1rem;
            margin-left: 0rem; 
            line-height: 1.2;
          ">${displayCountry}</div>
      `);

      const sortedStates = Object.keys(groupedLocations[country]).sort(
        (a, b) => {
          if (a === "NONE") return -1;
          if (b === "NONE") return 1;
          return a.localeCompare(b);
        },
      );

      sortedStates.forEach((state) => {
        groupedLocations[country][state].sort((a, b) =>
          a.displayName.localeCompare(b.displayName),
        );

        if (state !== "NONE") {
          htmlParts.push(`
            <div style="font-family: var(--font-sans); font-size: 0.65rem; color: rgba(28,28,28,0.5); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.5rem; margin-bottom: 0.5rem; margin-left: 1rem;">
              ${state}
            </div>
            <ul style="list-style-type: none; padding-left: 1.5rem; margin: 0; margin-bottom: 1.2rem; display: flex; flex-direction: column; gap: 0.25rem;">
          `);
        } else {
          htmlParts.push(`
            <ul style="list-style-type: none; padding-left: 1rem; margin: 0; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.25rem;">
          `);
        }

        groupedLocations[country][state].forEach((item) => {
          htmlParts.push(`
            <li class="sidebar-loc-link" data-index="${item.originalIndex}" style="font-size: 1rem; color: #1c1c1c;">
              ${item.displayName}
            </li>
          `);
        });

        htmlParts.push(`</ul>`);
      });

      htmlParts.push(`</li>`);
    });

    // 4. Render the panel
    panel.innerHTML = `
      <div style="padding: 0;"> 
        <div style="text-align: left; margin-top: 1rem; margin-bottom: 0.5rem;">
          <h2 style="margin: 0; color: #1c1c1c; font-weight: 600 !important; white-space: normal; font-size: 1.9rem; line-height: 1.1;">Index</h2>
          <div style="border-bottom: 1px solid #e2e0d8; margin-top: 1.2rem; margin-bottom: 1.5rem;"></div>
        </div>
        
        <ul style="list-style-type: none; padding-left: 0; margin: 0;">
          ${htmlParts.join("")}
        </ul>
      </div>
    `;

    // 5. Attach click events
    // OPT: one delegated listener on the panel instead of one per <li>
    panel.addEventListener("click", (e) => {
      const link = e.target.closest(".sidebar-loc-link");
      if (!link || !panel.contains(link)) return;

      const idx = parseInt(link.dataset.index, 10);
      const targetLocation = locations[idx];
      const targetMarker = targetLocation.markerInstance;

      if (targetMarker) {
        const targetLatLng = targetMarker.getLatLng();
        const visibleParent = markers.getVisibleParent(targetMarker);
        let targetZoom = computeTargetZoomForMarker(targetMarker);

        const currentZoom = map.getZoom();
        const drasticZoomThreshold = 5;

        if (
          currentZoom === targetZoom &&
          map.getCenter().equals(targetLatLng)
        ) {
          markers.zoomToShowLayer(targetMarker, () =>
            targetMarker.fire("click"),
          );
          return;
        }

        if (Math.abs(targetZoom - currentZoom) >= drasticZoomThreshold) {
          map.setView(targetLatLng, targetZoom, { animate: false });
          setTimeout(() => {
            markers.zoomToShowLayer(targetMarker, () =>
              targetMarker.fire("click"),
            );
          }, 50);
        } else {
          const flightDuration = targetZoom > 5 ? 1 : 0.7;
          map.flyTo(targetLatLng, targetZoom, {
            animate: true,
            duration: flightDuration,
            easeLinearity: 1,
          });
          map.once("moveend", () => {
            markers.zoomToShowLayer(targetMarker, () =>
              targetMarker.fire("click"),
            );
          });
        }
      }
    });
  }

  // --- CONSTANT ANCHOR MATH (WITH DOWNWARD OFFSET) ---
  function alignCaptionToImageTop() {
    const descWrapper = lightboxDescWrapper;
    if (!descWrapper) return;

    if (
      descWrapper.classList.contains("caption-collapsed") ||
      galImages.length <= 1
    ) {
      descWrapper.style.marginTop = "0px";
      return;
    }

    if (galleryTopGapLock !== null) {
      descWrapper.style.marginTop = `${galleryTopGapLock}px`;
      return;
    }

    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const maxW = windowW * 0.764 - 140;
    const maxH = windowH - 270;

    let shortestRenderedHeight = maxH;

    galImages.forEach((imgObj) => {
      // OPT: use a cached ratio when we've already measured this image once,
      // instead of constructing a new Image() and re-reading natural
      // dimensions on every single call (this runs on every image swap and
      // every resize event).
      let ratio = imageRatioCache.get(imgObj.src);

      if (ratio === undefined) {
        const temp = new Image();
        temp.src = imgObj.src;

        if (temp.complete && temp.naturalHeight > 0) {
          ratio = temp.naturalWidth / temp.naturalHeight;
          imageRatioCache.set(imgObj.src, ratio);
        }
      }

      if (ratio) {
        const renderedHeight = Math.min(maxH, maxW / ratio);
        if (renderedHeight < shortestRenderedHeight) {
          shortestRenderedHeight = renderedHeight;
        }
      }
    });

    // 1. Find the exact top edge
    const exactTopEdge = (windowH - shortestRenderedHeight) / 2;

    // 2. Add the downward push (0.01 = 1vh)
    const downwardPush = windowH * 0.01;

    // 3. Combine them and lock it in
    galleryTopGapLock = exactTopEdge + downwardPush;

    descWrapper.style.marginTop = `${Math.max(0, galleryTopGapLock)}px`;
  }

  // Clear the lock when the screen resizes so it can recalculate perfectly
  // OPT: debounced via rAF so a drag-resize doesn't run this on every event
  window.addEventListener(
    "resize",
    rafDebounce(() => {
      galleryTopGapLock = null;
      alignCaptionToImageTop();
    }),
  );

  function renderPanel(location) {
    const isStacked = location.mode === "stacked";
    const imgCount = location.images ? location.images.length : 0;

    let mainTitle = location.name;
    let subTitle = "";

    if (location.name.includes(":")) {
      const parts = location.name.split(":");
      mainTitle = parts[0].trim();
      subTitle = parts[1].trim();
    }

    // 1. Build the sidebar panel base HTML
    panel.innerHTML = `
      <style>
        .sb-dynamic-row { display: flex; flex-direction: row; gap: 6px; width: 100%; }
        
        /* Container tracking for thumbnails */
        .sb-dynamic-item { position: relative; overflow: hidden; cursor: zoom-in; container-type: inline-size; }
        .sb-dynamic-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.2s ease; }
        .sb-dynamic-item:hover img { opacity: 0.8; }

        /* Tooltip Base */
        .sb-hover-tooltip {
          position: absolute; bottom: 0px; left: 0px; right: 0px;
          background: rgba(28, 28, 28, 0.75); color: #ffffff;
          padding: 8px 12px; font-family: var(--font-sans);
          font-size: 0.73rem; line-height: 1.4; opacity: 0;
          pointer-events: none; transform: translateY(4px);
          transition: opacity 0.2s ease, transform 0.2s ease; z-index: 10;
        }
        .sb-dynamic-item:hover .sb-hover-tooltip {
          opacity: 1; transform: translateY(0);
        }

        /* --- 4-TIER AREA-BASED TEXT SWAPPING --- */
        .tt-small, .tt-medium-small, .tt-medium, .tt-large { display: none; } 
        
        /* The ResizeObserver assigns these classes based on area */
        .box-small .tt-small { display: inline; }
        .box-medium-small .tt-medium-small { display: inline; }
        .box-medium .tt-medium { display: inline; }
        .box-large .tt-large { display: inline; }

        @media (max-width: 1050px) {
          .sb-dynamic-row { flex-direction: column !important; }
          .sb-dynamic-item { flex: none !important; width: 100% !important; aspect-ratio: auto !important; }
          .sb-dynamic-item img { height: auto !important; max-height: 70vh; }
        }
      </style>
      
      <div id="sidebar-content-wrapper" style="padding: 0; margin: 0 auto; width: 100%; transition: max-width 0.3s ease; box-sizing: border-box;"> 
        
        <div style="text-align: left; margin-top: 1rem; margin-bottom: 0.5rem;">
          <h2 style="margin: 0; color: #1c1c1c; font-weight: 600 !important; white-space: normal; font-size: 1.9rem; line-height: 1.1;">
            ${mainTitle}
          </h2>
          ${
            subTitle
              ? `<div style="font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-body); text-transform: uppercase; letter-spacing: 0.15em; margin-top: 0.9rem; margin-bottom: 1.9rem; margin-left: 0rem; line-height: 1.2;">${subTitle}</div>`
              : ""
          }
        </div>
        
        <div id="sidebar-dynamic-gallery" style="display: flex; flex-direction: column; gap: 6px; margin-top: 1rem; margin-bottom: 2rem;"></div>
      
      </div>
    `;

    const galleryContainer = panel.querySelector("#sidebar-dynamic-gallery");

    if (isStacked && imgCount > 0) {
      const imagesData = location.images.map((img, index) => ({
        src: img.src,
        caption: img.detailedDescription || img.caption || "",
        origIdx: index,
      }));

      Promise.all(
        imagesData.map((img) => {
          return new Promise((resolve) => {
            const image = new Image();
            image.src = img.src;
            image.onload = () => {
              img.ratio = image.naturalWidth / image.naturalHeight;
              // OPT: feed the ratio we just computed into the shared cache
              // so alignCaptionToImageTop doesn't need to remeasure it later.
              imageRatioCache.set(img.src, img.ratio);
              resolve(img);
            };
            image.onerror = () => {
              img.ratio = 1.5;
              resolve(img);
            };
          });
        }),
      ).then((loadedImages) => {
        const n = loadedImages.length;
        const layoutGroups = [];
        let i = 0;

        // --- ORIGINAL EDITORIAL GROUPING LOGIC ---
        if (n === 1) {
          layoutGroups.push([loadedImages[0]]);
        } else if (n === 2) {
          if (loadedImages[0].ratio < 1 && loadedImages[1].ratio < 1) {
            layoutGroups.push([loadedImages[0], loadedImages[1]]);
          } else {
            layoutGroups.push([loadedImages[0]]);
            layoutGroups.push([loadedImages[1]]);
          }
        } else if (n === 3) {
          if (loadedImages[0].ratio > loadedImages[2].ratio) {
            layoutGroups.push([loadedImages[0]]);
            layoutGroups.push([loadedImages[1], loadedImages[2]]);
          } else {
            layoutGroups.push([loadedImages[0], loadedImages[1]]);
            layoutGroups.push([loadedImages[2]]);
          }
        } else if (n === 4) {
          layoutGroups.push([loadedImages[0]]);
          layoutGroups.push([loadedImages[1], loadedImages[2]]);
          layoutGroups.push([loadedImages[3]]);
        } else if (n === 5) {
          layoutGroups.push([loadedImages[0], loadedImages[1]]);
          layoutGroups.push([loadedImages[2], loadedImages[3]]);
          layoutGroups.push([loadedImages[4]]);
        } else {
          while (i < n) {
            const remaining = n - i;
            let groupSize = 2;

            if (remaining >= 3) {
              let hasPortrait = false;
              for (let j = 0; j < 3; j++) {
                if (loadedImages[i + j].ratio < 1) hasPortrait = true;
              }
              groupSize = hasPortrait ? 3 : 2;
            } else {
              groupSize = remaining;
            }

            layoutGroups.push(loadedImages.slice(i, i + groupSize));
            i += groupSize;
          }
        }

        // --- INITIALIZE THE 4-TIER AREA OBSERVER ---
        if (galleryResizeObserver) galleryResizeObserver.disconnect();

        galleryResizeObserver = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const area = entry.contentRect.width * entry.contentRect.height;
            const target = entry.target;

            target.classList.remove(
              "box-small",
              "box-medium-small",
              "box-medium",
              "box-large",
            );

            if (area < 40000) {
              target.classList.add("box-small");
            } else if (area <= 60000) {
              target.classList.add("box-medium-small");
            } else if (area <= 80000) {
              target.classList.add("box-medium");
            } else {
              target.classList.add("box-large");
            }
          });
        });

        // --- BUILD FLUID HTML ROWS ---
        // OPT: build rows in a document fragment and append once, instead of
        // appending each row directly to the live gallery container (fewer
        // reflow-triggering DOM insertions).
        const fragment = document.createDocumentFragment();

        layoutGroups.forEach((group) => {
          const rowDiv = document.createElement("div");
          rowDiv.className = "sb-dynamic-row";

          group.forEach((img) => {
            const imgWrapper = document.createElement("div");
            imgWrapper.className = "sb-dynamic-item";

            galleryResizeObserver.observe(imgWrapper);

            if (group.length === 1) {
              imgWrapper.style.flex = "1 1 100%";
            } else {
              imgWrapper.style.flex = `${img.ratio} 1 0%`;
              imgWrapper.style.aspectRatio = `${img.ratio}`;
            }

            imgWrapper.onclick = () =>
              openGalleryLightbox(location.images, img.origIdx);

            const imgEl = document.createElement("img");
            imgEl.src = img.src;
            if (n === 1) {
              imgEl.style.maxHeight = "60vh";
            } else if (group.length === 1) {
              imgEl.style.maxHeight = "72vh";
            }

            imgWrapper.appendChild(imgEl);

            // --- AREA-BASED CAPTION & FAST TOOLTIP ---
            if (img.caption && n > 1) {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = img.caption;
              let plainText = tempDiv.textContent || tempDiv.innerText || "";
              plainText = plainText.replace(/\s+/g, " ").trim();

              const words = plainText.split(" ");

              const textSmall =
                words.length > 8
                  ? words.slice(0, 8).join(" ") + "..."
                  : plainText;
              const textMediumSmall =
                words.length > 40
                  ? words.slice(0, 40).join(" ") + "..."
                  : plainText;
              const textMedium =
                words.length > 40
                  ? words.slice(0, 40).join(" ") + "..."
                  : plainText;
              const textLarge =
                words.length > 70
                  ? words.slice(0, 70).join(" ") + "..."
                  : plainText;

              if (plainText) {
                const customTooltip = document.createElement("div");
                customTooltip.className = "sb-hover-tooltip";

                customTooltip.innerHTML = `
                  <span class="tt-small">${textSmall}</span>
                  <span class="tt-medium-small">${textMediumSmall}</span>
                  <span class="tt-medium">${textMedium}</span>
                  <span class="tt-large">${textLarge}</span>
                `;

                imgWrapper.appendChild(customTooltip);

                const iconOverlay = document.createElement("div");
                iconOverlay.innerHTML = `
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                `;
                Object.assign(iconOverlay.style, {
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  color: "#ffffff",
                  padding: "5px",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                });

                imgWrapper.appendChild(iconOverlay);
              }
            }
            // --- END LOGIC ---

            rowDiv.appendChild(imgWrapper);
          });
          fragment.appendChild(rowDiv);
        });

        galleryContainer.appendChild(fragment);

        // Re-inject the description below the image
        if (n === 1 && loadedImages[0].caption) {
          const captionDiv = document.createElement("div");
          captionDiv.style.marginTop = "1.2rem";
          captionDiv.style.fontFamily = "var(--font-sans)";
          captionDiv.style.fontSize = "0.85rem";
          captionDiv.style.color = "#000000";
          captionDiv.style.lineHeight = "1.6";
          captionDiv.innerHTML = loadedImages[0].caption;
          galleryContainer.appendChild(captionDiv);
        }

        // --- TRIGGER THE SQUEEZE IF IT IS A SINGLE IMAGE ---
        if (n === 1) {
          const wrapper = panel.querySelector("#sidebar-content-wrapper");
          if (wrapper) {
            wrapper.classList.add("single-image-mode");
            wrapper.dataset.ratio = loadedImages[0].ratio; // Save ratio for resize math
            squeezeSidebarSingleImage(); // Snap it inward immediately!
          }
        }
      });
    }
  }

  // --- SMART SINGLE IMAGE MARGIN SQUEEZE ---
  function squeezeSidebarSingleImage() {
    const wrapper = document.querySelector(
      "#sidebar-content-wrapper.single-image-mode",
    );
    if (!wrapper) return;

    // 1. Clear any previous squeeze so we can measure the natural layout
    wrapper.style.maxWidth = "100%";

    const maxH = window.innerHeight * 0.6;
    const ratio = parseFloat(wrapper.dataset.ratio);

    if (ratio) {
      // 2. Measure the default width the panel gives us
      const defaultWidth = wrapper.getBoundingClientRect().width;

      // 3. Calculate how tall the image WOULD be if it took up that full width
      const projectedHeight = defaultWidth / ratio;

      // 4. If it breaks the 60vh ceiling, recalculate the width to force the margins inward
      if (projectedHeight > maxH) {
        const squeezedWidth = maxH * ratio;
        wrapper.style.maxWidth = `${squeezedWidth}px`;
      }
    }
  }

  // OPT: debounced via rAF, same rationale as the gallery resize listener
  window.addEventListener("resize", rafDebounce(squeezeSidebarSingleImage));

  /* --- MARKER & TOOLTIP LOGIC --- */
  const smallIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [20, 32],
    iconAnchor: [10, 32],
    shadowSize: [32, 32],
    shadowAnchor: [10, 32],
    className: "interactive-marker",
  });

  let activeMarker = null;

  // 1. Create the Cluster Group BEFORE the loop begins
  const markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 30,
    zoomToBoundsOnClick: false,
    removeOutsideVisibleBounds: false,

    disableClusteringAtZoom: 15,
    spiderfyOnMaxZoom: false,

    iconCreateFunction: function (cluster) {
      const count = cluster.getChildCount();
      return L.divIcon({
        html: `<div class="custom-cluster-icon">${count}</div>`,
        className: "",
        iconSize: L.point(36, 36),
      });
    },
  });

  // --- Controlled "Spread" Zoom ---
  markers.on("clusterclick", function (event) {
    const cluster = event.layer;
    const bounds = cluster.getBounds();
    const targetCenter = bounds.getCenter();
    const count = cluster.getChildCount();

    let currentZoom = map.getZoom();
    let targetZoom = currentZoom;

    const maxZoom = 15;
    const desiredPixelSpread = count > 2 ? 250 : 50;
    const drasticZoomThreshold = 5;

    for (let z = currentZoom; z <= maxZoom; z++) {
      const corner1 = map.project(bounds.getSouthWest(), z);
      const corner2 = map.project(bounds.getNorthEast(), z);
      const pixelSpread = corner1.distanceTo(corner2);

      if (pixelSpread >= desiredPixelSpread) {
        targetZoom = z;
        break;
      }
      if (z === maxZoom) targetZoom = maxZoom;
    }

    if (targetZoom <= currentZoom) {
      targetZoom = Math.min(currentZoom + 3, maxZoom);
    }

    if (Math.abs(targetZoom - currentZoom) >= drasticZoomThreshold) {
      map.setView(targetCenter, targetZoom, { animate: false });
    } else {
      map.flyTo(targetCenter, targetZoom, {
        animate: true,
        duration: 0.7,
        easeLinearity: 0.25,
      });
    }
  });

  // 1. Create a holding array for markers that need clustering
  const markerArray = [];

  // --- Count how many locations are in each country ---
  const countryCounts = {};
  locations.forEach((loc) => {
    const c = loc.country || "Other";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });

  // 2. Loop through your locations
  locations.forEach((location) => {
    const marker = L.marker(location.coords, { icon: smallIcon });
    location.markerInstance = marker;

    let tooltipImageSrc = "";
    if (
      location.mode === "stacked" &&
      location.images &&
      location.images.length > 0
    ) {
      tooltipImageSrc = location.images[0].src;
    } else if (location.previewImage) {
      tooltipImageSrc = location.previewImage;
    }

    let hoverTitle = location.name;
    if (location.name.includes(":")) {
      hoverTitle = location.name.split(":")[0].trim();
    }

    const hoverContent = `
      <div style="
        width: max-content; 
        white-space: nowrap; 
        padding: 5px 12px; 
        background-color: var(--bg-dark-accent, #3f464d); 
        color: var(--text-light, #f4f3ee); 
        font-family: var(--font-sans);
        font-size: 0.9em; 
        letter-spacing: 1px;
      ">
        ${hoverTitle}
      </div>
    `;

    marker.bindTooltip(hoverContent, {
      direction: "bottom",
      offset: [0, 5],
      className: "custom-map-tooltip",
      opacity: 1,
    });

    // 3. Handle the click event
    marker.on("click", () => {
      marker.closeTooltip();

      if (activeMarker && activeMarker !== marker) {
        const prevElement = activeMarker.getElement();
        if (prevElement) {
          prevElement.classList.remove("marker-active");
        }
      }

      activeMarker = marker;
      const currentElement = marker.getElement();
      if (currentElement) {
        currentElement.classList.add("marker-active");
      }

      renderPanel(location);
    });

    // --- 4. HYBRID ADD ---
    const c = location.country || "Other";
    if (countryCounts[c] === 1) {
      marker.addTo(map);
    } else {
      markerArray.push(marker);
    }
  });

  // 5. Finally, bulk-add the clustered array and add the cluster group to the map
  markers.addLayers(markerArray);
  map.addLayer(markers);

  // Render the sidebar now that the pins are ready!
  renderDefaultPanel();

  /* --- EVENT LISTENERS --- */
  if (galOverlay) {
    if (galPrev)
      galPrev.addEventListener("click", (e) => {
        e.stopPropagation();
        prevGalImage();
      });
    if (galNext)
      galNext.addEventListener("click", (e) => {
        e.stopPropagation();
        nextGalImage();
      });
    if (galClose) galClose.addEventListener("click", closeGalleryLightbox);
  }

  document.addEventListener("keydown", (event) => {
    if (!galOverlay?.classList.contains("hidden")) {
      if (event.key === "ArrowLeft") prevGalImage();
      if (event.key === "ArrowRight") nextGalImage();
      if (event.key === "Escape") closeGalleryLightbox();
    }
  });

  // --- URL PARAMETER ROUTING (NO DELAY) ---
  if (urlParams.has("loc")) {
    const locIndex = parseInt(urlParams.get("loc"), 10);

    if (!isNaN(locIndex) && locations[locIndex]) {
      const targetMarker = locations[locIndex].markerInstance;

      if (targetMarker) {
        // 1. Render the side gallery instantly
        renderPanel(locations[locIndex]);

        // 2. Calculate the exact targeted zoom (shared helper, same math as before)
        const targetZoom = computeTargetZoomForMarker(targetMarker);

        // 3. Instantly snap the map to the perfect calculated zoom
        map.setView(targetMarker.getLatLng(), targetZoom, { animate: false });

        // 4. Fire the click to highlight the active pin
        setTimeout(() => {
          targetMarker.fire("click");
        }, 50);
      }
    }
  }

  setTimeout(() => map.invalidateSize(), 300);
});