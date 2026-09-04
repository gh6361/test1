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

  let galImages = [];
  let galCurrentIndex = 0;
  let galActive = galImageA;
  let galInactive = galImageB;
  let galleryTopGapLock = null; // <-- NEW: Stores the calculated gap for the whole stack

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

  // --- NEW: Vertical-Only Limits ---
  // Latitude is strictly capped at -90 (South Pole) and 90 (North Pole).
  // Longitude is set to massive numbers so they can pan horizontally forever.
  const verticalBounds = [
    [-90, -10000],
    [90, 10000],
  ];

  // --- NEW: CHECK URL BEFORE INITIALIZING MAP ---
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

  // NEW: force Leaflet to re-measure the container immediately
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
          // First/Default case: moving to OR from the World view is an instant jump
          if (lastRegion === "world" || targetRegion === "world") {
            mapInstance.fitBounds(regionBounds[targetRegion], {
              animate: false,
              padding: [20, 20],
            });
          } else {
            // Moving continent-to-continent animates smoothly
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

  function renderGalImage(index) {
    if (!galImages.length || !galInactive || !galActive) return;
    galCurrentIndex = (index + galImages.length) % galImages.length;

    const image = galImages[galCurrentIndex];

    // 1. Tell the browser exactly what to do WHEN the download finishes FIRST
    galInactive.onload = () => {
      const descWrapper = document.querySelector(".lightbox-desc-wrapper");
      const centerGroup = document.querySelector(".lightbox-center-group");

      let counterEl = document.getElementById("lightbox-global-counter");
      if (!counterEl && galOverlay) {
        counterEl = document.createElement("div");
        counterEl.id = "lightbox-global-counter";
        galOverlay.appendChild(counterEl);
      }

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

        // --- RESTORED: FIRE THE MATH ---
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
    const siteNav = document.querySelector(".editorial-header");
    if (siteNav) siteNav.style.display = "none";

    const thumbContainer = document.getElementById("lightbox-thumbnails");

    // Set single-mode if needed
    if (images.length <= 1) {
      galOverlay.classList.add("single-mode");
      galOverlay.classList.remove("has-thumbnails");
      if (thumbContainer) thumbContainer.innerHTML = "";
    } else {
      galOverlay.classList.remove("single-mode");

      // --- NEW: Generate Thumbnails ---
      galOverlay.classList.add("has-thumbnails");
      if (thumbContainer) {
        thumbContainer.innerHTML = images
          .map(
            (img, idx) => `
          <img src="${img.src}" class="lb-thumb ${idx === (startIndex || 0) ? "active" : ""}" data-index="${idx}" alt="thumbnail">
        `,
          )
          .join("");

        // Make them clickable
        thumbContainer.querySelectorAll(".lb-thumb").forEach((thumb) => {
          thumb.addEventListener("click", (e) => {
            const clickedIdx = parseInt(e.target.dataset.index, 10);
            renderGalImage(clickedIdx);
          });
        });
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

    galleryTopGapLock = null; // <-- NEW: Reset the lock for the next location!

    // --- BRING THE NAVBAR BACK ---
    const siteNav = document.querySelector(".editorial-header");
    if (siteNav) siteNav.style.display = "";
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
    // 1. Group locations by Country
    const groupedLocations = {};

    locations.forEach((loc, index) => {
      // Default to "Other" if you forget to add a country tag
      const country = loc.country || "Other";

      // Simply use the default name logic (stripping out anything after a colon)
      const displayName = loc.name.includes(":")
        ? loc.name.split(":")[0].trim()
        : loc.name;

      // Create the country group array if it doesn't exist yet
      if (!groupedLocations[country]) {
        groupedLocations[country] = [];
      }

      // Push the item into its specific country group
      groupedLocations[country].push({
        displayName: displayName,
        originalIndex: index,
      });
    });

    // 2. Sort the countries alphabetically
    const sortedCountries = Object.keys(groupedLocations).sort((a, b) =>
      a.localeCompare(b),
    );

    // 3. Generate the grouped HTML list
    let locationListHtml = "";

    sortedCountries.forEach((country) => {
      // Sort the places alphabetically inside this specific country
      groupedLocations[country].sort((a, b) =>
        a.displayName.localeCompare(b.displayName),
      );

      // EXACT copy of your subtitle styling using a <div> to avoid global <h4> serif overrides!
      locationListHtml += `
        <li>
          <div style="
            font-family: var(--font-sans); 
            font-size: 0.75rem; 
            color: var(--text-body); 
            text-transform: uppercase; 
            letter-spacing: 0.15em; 
            margin-top: 0.9rem;
            margin-bottom: 0.9rem;
            margin-left: 0rem; 
            line-height: 1.2;
          ">${country}</div>
          <ul style="list-style-type: none; padding-left: 1rem; margin: 0; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.25rem;">
      `;

      // Add all the places beneath the header
      groupedLocations[country].forEach((item) => {
        locationListHtml += `
            <li class="sidebar-loc-link" data-index="${item.originalIndex}" style="font-size: 1rem; color: #1c1c1c;">
              ${item.displayName}
            </li>
        `;
      });

      locationListHtml += `
          </ul>
        </li>
      `;
    });

    // 4. Render the panel using your exact title wrapper from renderPanel
    panel.innerHTML = `
      <div style="padding: 0;"> 
        
        <div style="
          text-align: left; 
          margin-top: 1rem;   
          margin-bottom: 0.5rem; 
        ">
          <h2 style="
            margin: 0; 
            color: #1c1c1c; 
            font-weight: 600 !important; 
            white-space: normal;
            font-size: 1.9rem; 
            line-height: 1.1;
          ">Index</h2>
          
          <!-- The subtle border requested, spaced perfectly below the title -->
          <div style="border-bottom: 1px solid #e2e0d8; margin-top: 1.2rem; margin-bottom: 1.5rem;"></div>
        </div>
        
        <!-- The List -->
        <ul style="list-style-type: none; padding-left: 0; margin: 0;">
          ${locationListHtml}
        </ul>
        
      </div>
    `;

    // 5. Attach click events
    const links = panel.querySelectorAll(".sidebar-loc-link");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        const targetLocation = locations[idx];
        const targetMarker = targetLocation.markerInstance;

        if (targetMarker) {
          const targetLatLng = targetMarker.getLatLng();
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

          const currentZoom = map.getZoom();
          const drasticZoomThreshold = 5; // Uses the exact same logic as your clusters!

          // If we are already exactly where we need to be
          if (
            currentZoom === targetZoom &&
            map.getCenter().equals(targetLatLng)
          ) {
            markers.zoomToShowLayer(targetMarker, () =>
              targetMarker.fire("click"),
            );
            return;
          }

          // THE FIX: Instant teleport if the zoom jump is too large
          if (Math.abs(targetZoom - currentZoom) >= drasticZoomThreshold) {
            map.setView(targetLatLng, targetZoom, { animate: false });
            // A tiny 50ms delay gives the un-animated map time to physically paint the pins
            setTimeout(() => {
              markers.zoomToShowLayer(targetMarker, () =>
                targetMarker.fire("click"),
              );
            }, 50);
          } else {
            // Otherwise, smooth cinematic dive
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
    });
  }

  // --- NEW: CONSTANT ANCHOR MATH (WITH DOWNWARD OFFSET) ---
  function alignCaptionToImageTop() {
    const descWrapper = document.querySelector(".lightbox-desc-wrapper");
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
      const temp = new Image();
      temp.src = imgObj.src;

      if (temp.complete && temp.naturalHeight > 0) {
        const ratio = temp.naturalWidth / temp.naturalHeight;
        const renderedHeight = Math.min(maxH, maxW / ratio);

        if (renderedHeight < shortestRenderedHeight) {
          shortestRenderedHeight = renderedHeight;
        }
      }
    });

    // 1. Find the exact top edge
    const exactTopEdge = (windowH - shortestRenderedHeight) / 2;

    // 2. Add the downward push (0.04 = 4vh)
    const downwardPush = windowH * 0.01;

    // 3. Combine them and lock it in
    galleryTopGapLock = exactTopEdge + downwardPush;

    descWrapper.style.marginTop = `${Math.max(0, galleryTopGapLock)}px`;
  }

  // Clear the lock when the screen resizes so it can recalculate perfectly
  window.addEventListener("resize", () => {
    galleryTopGapLock = null;
    alignCaptionToImageTop();
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

    // 1. Build the sidebar panel base HTML (Now includes the squeeze wrapper!)
    panel.innerHTML = `
      <style>
        .sb-dynamic-row { display: flex; flex-direction: row; gap: 6px; width: 100%; }
        .sb-dynamic-item { position: relative; overflow: hidden; cursor: zoom-in; }
        .sb-dynamic-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.2s ease; }
        .sb-dynamic-item:hover img { opacity: 0.8; }

        /* --- NEW: CUSTOM INSTANT TOOLTIP --- */
        .sb-hover-tooltip {
          position: absolute;
          bottom: 1px;
          left: 1px;
          right: 1px;
          background: rgba(28, 28, 28, 0.75);
          color: #ffffff;
          padding: 8px 12px;
          border-radius: 0px;
          font-family: var(--font-sans);
          font-size: 0.73rem;
          line-height: 1.4;
          opacity: 0;
          pointer-events: none;
          transform: translateY(4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 10;
        }
        .sb-dynamic-item:hover .sb-hover-tooltip {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Mobile override */
        @media (max-width: 1050px) {
          .sb-dynamic-row { flex-direction: column !important; }
          .sb-dynamic-item { flex: none !important; width: 100% !important; aspect-ratio: auto !important; }
          .sb-dynamic-item img { height: auto !important; max-height: 70vh; }
        }
      </style>

      <!-- NEW: The wrapper we will mathematically squeeze for single images -->
      <div id="sidebar-content-wrapper" style="padding: 0; margin: 0 auto; width: 100%; transition: max-width 0.3s ease; box-sizing: border-box;"> 
        
        <div style="text-align: left; margin-top: 1rem; margin-bottom: 0.5rem;">
          <h2 style="margin: 0; color: #1c1c1c; font-weight: 600 !important; white-space: normal; font-size: 1.9rem; line-height: 1.1;">
            ${mainTitle}
          </h2>
          ${
            subTitle
              ? `<div style="font-family: var(--font-sans); font-size: 0.75rem; color: var(--text-body); text-transform: uppercase; letter-spacing: 0.15em; margin-top: 0.9rem; margin-bottom: 1.2rem; margin-left: 0rem; line-height: 1.2;">${subTitle}</div>`
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
          // If the first image is WIDER than the last image
          if (loadedImages[0].ratio > loadedImages[2].ratio) {
            layoutGroups.push([loadedImages[0]]);
            layoutGroups.push([loadedImages[1], loadedImages[2]]);
          }
          // If the last image is WIDER (or if they are perfectly equal)
          else {
            layoutGroups.push([loadedImages[0], loadedImages[1]]);
            layoutGroups.push([loadedImages[2]]);
          }
        } else if (n === 4) {
          // Row 1: One image
          layoutGroups.push([loadedImages[0]]);
          // Row 2: Two images side-by-side
          layoutGroups.push([loadedImages[1], loadedImages[2]]);
          // Row 3: One image
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

        // --- BUILD FLUID HTML ROWS ---
        layoutGroups.forEach((group) => {
          const rowDiv = document.createElement("div");
          rowDiv.className = "sb-dynamic-row";

          group.forEach((img) => {
            const imgWrapper = document.createElement("div");
            imgWrapper.className = "sb-dynamic-item";

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

            // --- NEW: DYNAMIC WORD-COUNT CAPTION & FAST TOOLTIP ---
            if (img.caption && n > 1) {
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = img.caption;
              let plainText = tempDiv.textContent || tempDiv.innerText || "";
              plainText = plainText.replace(/\s+/g, " ").trim();

              // Determine the exact word limit based on total gallery size (n)
              const wordLimit = n >= 5 ? 20 : 70;

              const words = plainText.split(" ");
              const shortText =
                words.length > wordLimit
                  ? words.slice(0, wordLimit).join(" ") + "..."
                  : plainText;

              if (shortText) {
                // 1. Inject the fast CSS tooltip
                const customTooltip = document.createElement("div");
                customTooltip.className = "sb-hover-tooltip";
                customTooltip.textContent = shortText;
                imgWrapper.appendChild(customTooltip);

                // 2. Document Icon Overlay
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
            // --- END NEW LOGIC ---

            rowDiv.appendChild(imgWrapper);
          });

          galleryContainer.appendChild(rowDiv);
        });

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

        // --- NEW: TRIGGER THE SQUEEZE IF IT IS A SINGLE IMAGE ---
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

  // --- UPDATED: SMART SINGLE IMAGE MARGIN SQUEEZE ---
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

  window.addEventListener("resize", squeezeSidebarSingleImage);

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

  // --- NEW: Add this line back in! ---
  let activeMarker = null;

  // 1. Create the Cluster Group BEFORE the loop begins
  const markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 30,
    zoomToBoundsOnClick: false,
    removeOutsideVisibleBounds: false,

    // The Kill Switches
    disableClusteringAtZoom: 15,
    spiderfyOnMaxZoom: false, // <-- NEW: Completely disables the spider web fallback!

    iconCreateFunction: function (cluster) {
      const count = cluster.getChildCount();
      return L.divIcon({
        html: `<div class="custom-cluster-icon">${count}</div>`,
        className: "",
        iconSize: L.point(36, 36),
      });
    },
  });

  // --- NEW: Controlled "Spread" Zoom ---
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

    // THE FIX: If the math tells it to stay on the exact same zoom level,
    // force it to zoom in by at least 1 step (up to the max) so the click always works!
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

  // --- NEW: Count how many locations are in each country ---
  const countryCounts = {};
  locations.forEach((loc) => {
    const c = loc.country || "Other";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });

  // 2. Loop through your locations
  locations.forEach((location) => {
    // IMPORTANT: Create the marker
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
    // If it is the only location in the country, glue it securely to the base map.
    // If there are multiple, send them to the cluster array!
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

        // 2. Calculate the exact targeted zoom (identical to sidebar logic!)
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

        // 3. Instantly snap the map to the perfect calculated zoom
        map.setView(targetMarker.getLatLng(), targetZoom, { animate: false });

        // 4. Fire the click to highlight the active pin
        // (A tiny 50ms delay guarantees the map tiles have snapped first)
        setTimeout(() => {
          targetMarker.fire("click");
        }, 50);
      }
    }
  }

  setTimeout(() => map.invalidateSize(), 300);
});
