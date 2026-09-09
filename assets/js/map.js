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

  const lightboxDescWrapper = document.querySelector(".lightbox-desc-wrapper");
  const lightboxCenterGroup = document.querySelector(".lightbox-center-group");
  const siteNavEl = document.querySelector(".editorial-header");
  let lightboxCounterEl = document.getElementById("lightbox-global-counter");
  const thumbContainer = document.getElementById("lightbox-thumbnails");

  const imageRatioCache = new Map();

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
  let galleryTopGapLock = null;

  if (!mapEl || !panel || typeof L === "undefined") return;

  const regionBounds = {
    world: [
      [-55, -170],
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

  const verticalBounds = [
    [-90, -10000],
    [90, 10000],
  ];

  const urlParams = new URLSearchParams(window.location.search);
  let startCenter = null;
  let startZoom = null;

  if (urlParams.has("loc")) {
    const locIdx = parseInt(urlParams.get("loc"), 10);
    if (!isNaN(locIdx) && locations[locIdx]) {
      startCenter = locations[locIdx].coords;
      startZoom = 6;
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

  map.invalidateSize();

  if (startCenter && startZoom) {
    map.setView(startCenter, startZoom);
  } else {
    map.fitBounds(regionBounds.world);
  }

  L.control.zoom({ position: "bottomright" }).addTo(map);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

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

    let lastRegion = "world";
    div.addEventListener("click", (e) => {
      const targetRegion = e.target.dataset.region;
      if (!targetRegion || !regionBounds[targetRegion]) return;

      const currentZoom = mapInstance.getZoom();
      const isZoomedIn = currentZoom > 4;
      const isWorldTransition =
        lastRegion === "world" || targetRegion === "world";

      if (isZoomedIn || !isWorldTransition) {
        mapInstance.fitBounds(regionBounds[targetRegion], {
          animate: false,
          padding: [20, 20],
        });
      } else {
        mapInstance.flyToBounds(regionBounds[targetRegion], {
          duration: 0.7,
          padding: [20, 20],
        });
      }
      lastRegion = targetRegion;
    });
    return div;
  };
  regionControl.addTo(map);

  function swapGalImages() {
    [galActive, galInactive] = [galInactive, galActive];
  }

  function computeTargetZoomForMarker(targetMarker) {
    let targetZoom = 6;
    const visibleParent = markers.getVisibleParent(targetMarker);
    if (visibleParent && visibleParent !== targetMarker) {
      if (
        targetMarker.__parent &&
        typeof targetMarker.__parent._zoom === "number"
      ) {
        targetZoom = Math.min(targetMarker.__parent._zoom + 1, 15);
      } else {
        targetZoom = 15;
      }
    }
    return Math.max(targetZoom, 6);
  }

  function renderGalImage(index) {
    if (!galImages.length || !galInactive || !galActive) return;
    galCurrentIndex = (index + galImages.length) % galImages.length;
    const image = galImages[galCurrentIndex];

    galInactive.onload = () => {
      if (!lightboxCounterEl && galOverlay) {
        lightboxCounterEl = document.createElement("div");
        lightboxCounterEl.id = "lightbox-global-counter";
        galOverlay.appendChild(lightboxCounterEl);
      }

      if (galImages.length <= 1) {
        if (lightboxDescWrapper) lightboxDescWrapper.style.display = "none";
        if (lightboxCounterEl) lightboxCounterEl.style.display = "none";
        if (galCaption) galCaption.innerHTML = "";
      } else {
        if (lightboxDescWrapper) lightboxDescWrapper.style.display = "";
        if (lightboxCounterEl) {
          lightboxCounterEl.style.display = "block";
          lightboxCounterEl.innerHTML = `${galCurrentIndex + 1} / ${galImages.length}`;
        }

        const hasDesc = !!image.detailedDescription;
        const hasCol = image.collections && image.collections.length > 0;

        if (!hasDesc && !hasCol) {
          lightboxDescWrapper?.classList.add("caption-collapsed");
          lightboxCenterGroup?.classList.add("no-caption");
          if (galCaption) galCaption.innerHTML = "";
        } else {
          lightboxDescWrapper?.classList.remove("caption-collapsed");
          lightboxCenterGroup?.classList.remove("no-caption");
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
      requestAnimationFrame(() => {
        galActive.classList.remove("active");
        galInactive.classList.add("active");
        swapGalImages();

        const activeThumb = document.querySelector(".lb-thumb.active");
        if (activeThumb) activeThumb.classList.remove("active");
        const newThumb = document.querySelector(
          `.lb-thumb[data-index="${galCurrentIndex}"]`,
        );
        if (newThumb) newThumb.classList.add("active");

        setTimeout(alignCaptionToImageTop, 50);
        // --- ADD THIS LINE HERE ---
        // Preload the next/prev images only AFTER the current one is safely on screen
        preloadAdjacentImages();
      });
    };

    galInactive.src = "";
    galInactive.src = image.src;
    galInactive.alt = image.caption || `Image ${galCurrentIndex + 1}`;
  }

  // OPT: Add thumbnail event listener globally ONCE to prevent memory leaks
  if (thumbContainer) {
    thumbContainer.addEventListener("click", (e) => {
      const thumbEl = e.target.closest(".lb-thumb");
      if (!thumbEl) return;
      const clickedIdx = parseInt(thumbEl.dataset.index, 10);
      renderGalImage(clickedIdx);
    });
  }

  function openGalleryLightbox(images, startIndex) {
    if (!galOverlay) return;
    galImages = images;

    if (siteNavEl) siteNavEl.style.display = "none";

    if (images.length <= 1) {
      galOverlay.classList.add("single-mode");
      galOverlay.classList.remove("has-thumbnails");
      if (thumbContainer) thumbContainer.innerHTML = "";
    } else {
      galOverlay.classList.remove("single-mode");
      galOverlay.classList.add("has-thumbnails");
      if (thumbContainer) {
        thumbContainer.innerHTML = images
          .map(
            (img, idx) =>
              `<img src="${img.thumbSrc || img.src}" class="lb-thumb ${idx === (startIndex || 0) ? "active" : ""}" data-index="${idx}" alt="thumbnail">`,
          )
          .join("");
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
    galleryTopGapLock = null;

    if (siteNavEl) siteNavEl.style.display = "";
  }

  function nextGalImage() {
    if (galImages.length > 1) renderGalImage(galCurrentIndex + 1);
  }
  function prevGalImage() {
    if (galImages.length > 1) renderGalImage(galCurrentIndex - 1);
  }

  function preloadAdjacentImages() {
    if (galImages.length <= 1) return;

    // Calculate the next and previous index wrapping around the array
    const nextIdx = (galCurrentIndex + 1) % galImages.length;
    const prevIdx = (galCurrentIndex - 1 + galImages.length) % galImages.length;

    // Create detached Image objects to force the browser to download them into cache
    const preNext = new Image();
    preNext.src = galImages[nextIdx].src;

    const prePrev = new Image();
    prePrev.src = galImages[prevIdx].src;
  }

  function renderDefaultPanel() {
    const groupedLocations = {};
    locations.forEach((loc, index) => {
      const country = loc.country || "Other";
      const state = loc.state || "NONE";
      const displayName = loc.name.includes(":")
        ? loc.name.split(":")[0].trim()
        : loc.name;

      if (!groupedLocations[country]) groupedLocations[country] = {};
      if (!groupedLocations[country][state])
        groupedLocations[country][state] = [];
      groupedLocations[country][state].push({
        displayName,
        originalIndex: index,
      });
    });

    const sortedCountries = Object.keys(groupedLocations).sort((a, b) =>
      a.localeCompare(b),
    );
    const htmlParts = [];

    sortedCountries.forEach((country) => {
      const displayCountry =
        country.toUpperCase() === "UNITED STATES" ||
        country.toUpperCase() === "U.S."
          ? "UNITED STATES"
          : country;
      htmlParts.push(`
        <li>
          <div style="font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-body); text-transform: uppercase; letter-spacing: 0.15em; margin: 0.9rem 0 1.1rem 0; line-height: 1.2;">
            ${displayCountry}
          </div>
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
            <div style="font-family: var(--font-sans); font-size: 0.65rem; color: rgba(28,28,28,0.5); text-transform: uppercase; letter-spacing: 0.1em; margin: 0.5rem 0 0.5rem 1rem;">
              ${state}
            </div>
            <ul style="list-style-type: none; padding-left: 1.5rem; margin: 0 0 1.2rem 0; display: flex; flex-direction: column; gap: 0.25rem;">
          `);
        } else {
          htmlParts.push(
            `<ul style="list-style-type: none; padding-left: 1rem; margin: 0 0 1.5rem 0; display: flex; flex-direction: column; gap: 0.25rem;">`,
          );
        }

        groupedLocations[country][state].forEach((item) => {
          htmlParts.push(
            `<li class="sidebar-loc-link" data-index="${item.originalIndex}" style="font-size: 1rem; color: #1c1c1c; cursor: pointer;">${item.displayName}</li>`,
          );
        });
        htmlParts.push(`</ul>`);
      });
      htmlParts.push(`</li>`);
    });

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
  }

  // OPT: Add panel click event globally ONCE
  panel.addEventListener("click", (e) => {
    const link = e.target.closest(".sidebar-loc-link");
    if (!link || !panel.contains(link)) return;

    const idx = parseInt(link.dataset.index, 10);
    const targetMarker = locations[idx].markerInstance;

    if (targetMarker) {
      const targetLatLng = targetMarker.getLatLng();
      const targetZoom = computeTargetZoomForMarker(targetMarker);
      const currentZoom = map.getZoom();

      if (currentZoom === targetZoom && map.getCenter().equals(targetLatLng)) {
        markers.zoomToShowLayer(targetMarker, () => targetMarker.fire("click"));
        return;
      }

      if (Math.abs(targetZoom - currentZoom) >= 5) {
        map.setView(targetLatLng, targetZoom, { animate: false });
        setTimeout(
          () =>
            markers.zoomToShowLayer(targetMarker, () =>
              targetMarker.fire("click"),
            ),
          50,
        );
      } else {
        map.flyTo(targetLatLng, targetZoom, {
          animate: true,
          duration: targetZoom > 5 ? 1 : 0.7,
          easeLinearity: 1,
        });
        map.once("moveend", () =>
          markers.zoomToShowLayer(targetMarker, () =>
            targetMarker.fire("click"),
          ),
        );
      }
    }
  });

  function alignCaptionToImageTop() {
    if (!lightboxDescWrapper) return;
    if (
      lightboxDescWrapper.classList.contains("caption-collapsed") ||
      galImages.length <= 1
    ) {
      lightboxDescWrapper.style.marginTop = "0px";
      return;
    }
    if (galleryTopGapLock !== null) {
      lightboxDescWrapper.style.marginTop = `${galleryTopGapLock}px`;
      return;
    }

    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const maxW = windowW * 0.764 - 140;
    const maxH = windowH - 270;
    let shortestRenderedHeight = maxH;

    galImages.forEach((imgObj) => {
      let ratio = imgObj.ratio || imageRatioCache.get(imgObj.src);
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
        if (renderedHeight < shortestRenderedHeight)
          shortestRenderedHeight = renderedHeight;
      }
    });

    galleryTopGapLock = (windowH - shortestRenderedHeight) / 2 + windowH * 0.01;
    lightboxDescWrapper.style.marginTop = `${Math.max(0, galleryTopGapLock)}px`;
  }

  window.addEventListener(
    "resize",
    rafDebounce(() => {
      galleryTopGapLock = null;
      alignCaptionToImageTop();
    }),
  );

  // OPT: Define ResizeObserver ONCE globally to prevent instantiating multiple observers per pin click
  const galleryResizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const area = entry.contentRect.width * entry.contentRect.height;
      const t = entry.target.classList;
      t.remove("box-small", "box-medium", "box-large");

      if (area < 40000) t.add("box-small");
      else if (area <= 80000) t.add("box-medium");
      else t.add("box-large");
    });
  });

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

    panel.innerHTML = `
      <style>
        .sb-dynamic-row { display: flex; flex-direction: row; gap: 6px; width: 100%; }
        .sb-dynamic-item { position: relative; overflow: hidden; cursor: zoom-in; container-type: inline-size; }
        .sb-dynamic-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.2s ease; }
        .sb-dynamic-item:hover img { opacity: 0.8; }
        .sb-hover-tooltip { position: absolute; bottom: 0px; left: 0px; right: 0px; background: rgba(28, 28, 28, 0.75); color: #ffffff; padding: 8px 12px; font-family: var(--font-sans); font-size: 0.73rem; line-height: 1.4; opacity: 0; pointer-events: none; transform: translateY(4px); transition: opacity 0.2s ease, transform 0.2s ease; z-index: 10; }
        .sb-dynamic-item:hover .sb-hover-tooltip { opacity: 1; transform: translateY(0); }
        .tt-small, .tt-medium, .tt-large { display: none; } 
        .box-small .tt-small, .box-medium .tt-medium, .box-large .tt-large { display: inline; }
        @media (max-width: 1050px) {
          .sb-dynamic-row { flex-direction: column !important; }
          .sb-dynamic-item { flex: none !important; width: 100% !important; aspect-ratio: auto !important; }
          .sb-dynamic-item img { height: auto !important; max-height: 70vh; }
        }
      </style>
      <div id="sidebar-content-wrapper" style="padding: 0; margin: 0 auto; width: 100%; transition: max-width 0.3s ease; box-sizing: border-box;"> 
        <div style="text-align: left; margin-top: 1rem; margin-bottom: 0.5rem;">
          <h2 style="margin: 0; color: #1c1c1c; font-weight: 600 !important; white-space: normal; font-size: 1.9rem; line-height: 1.1;">${mainTitle}</h2>
          ${subTitle ? `<div style="font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-body); text-transform: uppercase; letter-spacing: 0.15em; margin: 0.9rem 0 1.9rem 0; line-height: 1.2;">${subTitle}</div>` : ""}
        </div>
        <div id="sidebar-dynamic-gallery" style="display: flex; flex-direction: column; gap: 6px; margin-top: 1rem; margin-bottom: 2rem;"></div>
      </div>
    `;

    const galleryContainer = panel.querySelector("#sidebar-dynamic-gallery");

    if (isStacked && imgCount > 0) {
      // Map data synchronously
      const loadedImages = location.images.map((img, index) => ({
        src: img.src,
        thumbSrc: img.thumbSrc || img.src,
        ratio: img.ratio || 1.5,
        detailedDescription: img.detailedDescription, // <-- Add this line back!
        caption: img.detailedDescription || img.caption || "",
        origIdx: index,
      }));

      const n = loadedImages.length;
      const layoutGroups = [];
      let i = 0;

      if (n === 1) layoutGroups.push([loadedImages[0]]);
      else if (n === 2) {
        if (loadedImages[0].ratio < 1 && loadedImages[1].ratio < 1)
          layoutGroups.push([loadedImages[0], loadedImages[1]]);
        else layoutGroups.push([loadedImages[0]], [loadedImages[1]]);
      } else if (n === 3) {
        if (loadedImages[0].ratio > loadedImages[2].ratio)
          layoutGroups.push(
            [loadedImages[0]],
            [loadedImages[1], loadedImages[2]],
          );
        else
          layoutGroups.push(
            [loadedImages[0], loadedImages[1]],
            [loadedImages[2]],
          );
      } else if (n === 4) {
        layoutGroups.push(
          [loadedImages[0]],
          [loadedImages[1], loadedImages[2]],
          [loadedImages[3]],
        );
      } else if (n === 5) {
        layoutGroups.push(
          [loadedImages[0], loadedImages[1]],
          [loadedImages[2], loadedImages[3]],
          [loadedImages[4]],
        );
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

      galleryResizeObserver.disconnect();
      const fragment = document.createDocumentFragment();

      layoutGroups.forEach((group) => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "sb-dynamic-row";

        group.forEach((img) => {
          const imgWrapper = document.createElement("div");
          imgWrapper.className = "sb-dynamic-item";
          galleryResizeObserver.observe(imgWrapper);

          if (group.length === 1) imgWrapper.style.flex = "1 1 100%";
          else {
            imgWrapper.style.flex = `${img.ratio} 1 0%`;
            imgWrapper.style.aspectRatio = `${img.ratio}`;
          }

          imgWrapper.onclick = () =>
            openGalleryLightbox(loadedImages, img.origIdx);

          const imgEl = document.createElement("img");
          // Use thumbSrc for the sidebar, load asynchronously
          imgEl.src = img.thumbSrc;
          imgEl.loading = "lazy";
          imgEl.decoding = "async";

          if (n === 1) imgEl.style.maxHeight = "60vh";
          else if (group.length === 1) imgEl.style.maxHeight = "72vh";
          imgWrapper.appendChild(imgEl);

          if (img.caption && n > 1) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = img.caption;
            const plainText = (tempDiv.textContent || tempDiv.innerText || "")
              .replace(/\s+/g, " ")
              .trim();
            const words = plainText.split(" ");

            if (plainText) {
              const customTooltip = document.createElement("div");
              customTooltip.className = "sb-hover-tooltip";
              customTooltip.innerHTML = `
                <span class="tt-small">${words.length > 8 ? words.slice(0, 8).join(" ") + "..." : plainText}</span>
                <span class="tt-medium">${words.length > 40 ? words.slice(0, 40).join(" ") + "..." : plainText}</span>
                <span class="tt-large">${words.length > 70 ? words.slice(0, 70).join(" ") + "..." : plainText}</span>
              `;
              imgWrapper.appendChild(customTooltip);

              const iconOverlay = document.createElement("div");
              iconOverlay.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
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
          rowDiv.appendChild(imgWrapper);
        });
        fragment.appendChild(rowDiv);
      });

      galleryContainer.appendChild(fragment);

      if (n === 1 && loadedImages[0].caption) {
        const captionDiv = document.createElement("div");
        Object.assign(captionDiv.style, {
          marginTop: "1.2rem",
          fontFamily: "var(--font-sans)",
          fontSize: "0.85rem",
          color: "#000000",
          lineHeight: "1.6",
        });
        captionDiv.innerHTML = loadedImages[0].caption;
        galleryContainer.appendChild(captionDiv);
      }

      if (n === 1) {
        const wrapper = panel.querySelector("#sidebar-content-wrapper");
        if (wrapper) {
          wrapper.classList.add("single-image-mode");
          wrapper.dataset.ratio = loadedImages[0].ratio;
          squeezeSidebarSingleImage();
        }
      }
    }
  }

  function squeezeSidebarSingleImage() {
    const wrapper = document.querySelector(
      "#sidebar-content-wrapper.single-image-mode",
    );
    if (!wrapper) return;
    wrapper.style.maxWidth = "100%";
    const maxH = window.innerHeight * 0.6;
    const ratio = parseFloat(wrapper.dataset.ratio);

    if (ratio) {
      const defaultWidth = wrapper.getBoundingClientRect().width;
      if (defaultWidth / ratio > maxH) {
        wrapper.style.maxWidth = `${maxH * ratio}px`;
      }
    }
  }

  window.addEventListener("resize", rafDebounce(squeezeSidebarSingleImage));

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

  const markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 30,
    zoomToBoundsOnClick: false,
    removeOutsideVisibleBounds: false,
    disableClusteringAtZoom: 15,
    spiderfyOnMaxZoom: false,
    iconCreateFunction: (cluster) =>
      L.divIcon({
        html: `<div class="custom-cluster-icon">${cluster.getChildCount()}</div>`,
        className: "",
        iconSize: L.point(36, 36),
      }),
  });

  markers.on("clusterclick", (event) => {
    const cluster = event.layer;
    const bounds = cluster.getBounds();
    const targetCenter = bounds.getCenter();
    const currentZoom = map.getZoom();
    let targetZoom = currentZoom;

    const desiredPixelSpread = cluster.getChildCount() > 2 ? 250 : 50;
    for (let z = currentZoom; z <= 15; z++) {
      if (
        map
          .project(bounds.getSouthWest(), z)
          .distanceTo(map.project(bounds.getNorthEast(), z)) >=
        desiredPixelSpread
      ) {
        targetZoom = z;
        break;
      }
      if (z === 15) targetZoom = 15;
    }

    if (targetZoom <= currentZoom) targetZoom = Math.min(currentZoom + 3, 15);

    if (Math.abs(targetZoom - currentZoom) >= 5) {
      map.setView(targetCenter, targetZoom, { animate: false });
    } else {
      map.flyTo(targetCenter, targetZoom, {
        animate: true,
        duration: 0.7,
        easeLinearity: 0.25,
      });
    }
  });

  const markerArray = [];
  const countryCounts = {};
  locations.forEach((loc) => {
    const c = loc.country || "Other";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });

  locations.forEach((location) => {
    const marker = L.marker(location.coords, { icon: smallIcon });
    location.markerInstance = marker;

    marker.bindTooltip(
      `
      <div style="width: max-content; white-space: nowrap; padding: 5px 12px; background-color: var(--bg-dark-accent, #3f464d); color: var(--text-light, #f4f3ee); font-family: var(--font-sans); font-size: 0.9em; letter-spacing: 1px;">
        ${location.name.includes(":") ? location.name.split(":")[0].trim() : location.name}
      </div>
    `,
      {
        direction: "bottom",
        offset: [0, 5],
        className: "custom-map-tooltip",
        opacity: 1,
      },
    );

    marker.on("click", () => {
      marker.closeTooltip();
      if (activeMarker && activeMarker !== marker)
        activeMarker.getElement()?.classList.remove("marker-active");
      activeMarker = marker;
      marker.getElement()?.classList.add("marker-active");
      renderPanel(location);
    });

    if (countryCounts[location.country || "Other"] === 1) marker.addTo(map);
    else markerArray.push(marker);
  });

  markers.addLayers(markerArray);
  map.addLayer(markers);
  renderDefaultPanel();

  if (galOverlay) {
    galPrev?.addEventListener("click", (e) => {
      e.stopPropagation();
      prevGalImage();
    });
    galNext?.addEventListener("click", (e) => {
      e.stopPropagation();
      nextGalImage();
    });
    galClose?.addEventListener("click", closeGalleryLightbox);
  }

  document.addEventListener("keydown", (event) => {
    if (!galOverlay?.classList.contains("hidden")) {
      if (event.key === "ArrowLeft") prevGalImage();
      if (event.key === "ArrowRight") nextGalImage();
      if (event.key === "Escape") closeGalleryLightbox();
    }
  });

  if (urlParams.has("loc")) {
    const locIndex = parseInt(urlParams.get("loc"), 10);
    if (!isNaN(locIndex) && locations[locIndex]) {
      const targetMarker = locations[locIndex].markerInstance;
      if (targetMarker) {
        renderPanel(locations[locIndex]);
        map.setView(
          targetMarker.getLatLng(),
          computeTargetZoomForMarker(targetMarker),
          { animate: false },
        );
        setTimeout(() => targetMarker.fire("click"), 50);
      }
    }
  }

  setTimeout(() => map.invalidateSize(), 300);
});
