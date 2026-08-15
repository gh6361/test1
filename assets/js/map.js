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

  if (!mapEl || !panel || typeof L === "undefined") return;

  // Define coordinate boundaries FIRST so the map can use them to load
  const regionBounds = {
    world: [
      [-55, -125], // Western edge (Keeps North America in frame)
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

  // Initialize map with fractional zooming for a perfect, fluid fit
  const map = L.map(mapEl, {
    zoomControl: false,
    zoomSnap: 0.1,
    wheelPxPerZoomLevel: 100,
    minZoom: 1.8,

    // Apply the vertical-only bounds
    maxBounds: verticalBounds,
    maxBoundsViscosity: 1.0,

    // --- NEW: Seamless Wrapping ---
    // This tells Leaflet to seamlessly teleport the user's view if they drag
    // across the world's edge, making the infinite horizontal scrolling feel flawless.
    worldCopyJump: true,
  }).fitBounds(regionBounds.world);

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

    const buttons = div.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const region = e.target.dataset.region;
        if (regionBounds[region]) {
          mapInstance.flyToBounds(regionBounds[region], {
            duration: 1.5,
            padding: [20, 20],
          });
        }
      });
    });

    return div; // Correctly placed inside the function block
  };

  regionControl.addTo(map);

  function swapGalImages() {
    [galActive, galInactive] = [galInactive, galActive];
  }

  function renderGalImage(index) {
    if (!galImages.length || !galInactive || !galActive) return;
    galCurrentIndex = (index + galImages.length) % galImages.length;

    const image = galImages[galCurrentIndex];

    // --- NEW CAPTION HTML INJECTION ---
    if (galCaption) {
      let collectionsHTML = "";
      if (image.collections && image.collections.length > 0) {
        const links = image.collections
          .map((c) => `<a href="${c.url}">${c.name}</a>`)
          .join(", ");
        collectionsHTML = `In collections: ${links}`;
      }

      // NEW: Only show the index counter if there is more than 1 image
      let indexHtml = "";
      if (galImages.length > 1) {
        indexHtml = `<div class="caption-index">${galCurrentIndex + 1} / ${galImages.length}</div>`;
      }

      galCaption.innerHTML = `
        ${indexHtml} <!-- Injected right above the main title -->
        
        ${image.detailedDescription ? `<div class="caption-details">${image.detailedDescription}</div>` : ""}
        
        ${collectionsHTML ? `<div class="caption-collections">${collectionsHTML}</div>` : ""}
      `;
    }
    // --- END NEW CAPTION LOGIC ---

    galInactive.src = image.src;
    galInactive.alt = image.caption || `Image ${galCurrentIndex + 1}`;

    galOverlay.classList.remove("hidden");

    requestAnimationFrame(() => {
      galActive.classList.remove("active");
      galInactive.classList.add("active");
      swapGalImages();

      // --- NEW: Update active thumbnail border ---
      const thumbs = document.querySelectorAll(".lb-thumb");
      if (thumbs.length > 0) {
        thumbs.forEach((t) => t.classList.remove("active"));
        const activeThumb = document.querySelector(
          `.lb-thumb[data-index="${galCurrentIndex}"]`,
        );
        if (activeThumb) activeThumb.classList.add("active");
      }

      // --- BULLETPROOF ALIGNMENT TRIGGER ---
      // A small helper function that adds a tiny 50-millisecond delay.
      // This forces the JavaScript to wait until the browser has physically
      // painted the image to the screen BEFORE trying to measure it!
      const triggerAlignment = () => {
        setTimeout(alignCaptionToImageTop, 50);
      };

      // Check if the image is already fully loaded (e.g., from cache or resize)
      if (galActive.complete && galActive.naturalHeight > 0) {
        triggerAlignment();
      } else {
        // If it's a fresh load (first click), wait for the exact millisecond
        // the file finishes downloading, THEN fire our delayed trigger.
        galActive.onload = triggerAlignment;
      }
    });
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

  // CONSTANT HEIGHT LOGIC (Locks to the top edge of the shortest photo)
  function alignCaptionToImageTop() {
    const descWrapper = document.querySelector(".lightbox-desc-wrapper");
    const centerGroup = document.querySelector(".lightbox-center-group");
    const activeImg = document.querySelector(".lightbox-image.active");

    if (
      !descWrapper ||
      !centerGroup ||
      !activeImg ||
      activeImg.naturalHeight === 0
    )
      return;

    const groupHeight = centerGroup.getBoundingClientRect().height;

    // 1. Read the live CSS constraints to mathematically check the gallery
    const computed = window.getComputedStyle(activeImg);
    const maxHeight = parseFloat(computed.maxHeight) || window.innerHeight;
    const maxWidth = parseFloat(computed.maxWidth) || window.innerWidth;

    // Start with the maximum possible height
    let minRenderedHeight = maxHeight;

    // 2. Loop through the gallery array to find the absolute shortest image height
    galImages.forEach((imgData) => {
      const tempImg = new Image();
      tempImg.src = imgData.src;

      // If the browser already knows the dimensions
      if (tempImg.naturalHeight > 0) {
        const ratio = tempImg.naturalWidth / tempImg.naturalHeight;
        const containerRatio = maxWidth / maxHeight;

        let renderedHeight = maxHeight;
        if (ratio > containerRatio) {
          renderedHeight = maxWidth / ratio; // Image is limited by width
        }

        if (renderedHeight < minRenderedHeight) {
          minRenderedHeight = renderedHeight;
        }
      }
    });

    // 3. Because the images are vertically centered, the distance from the top
    // of the container down to the shortest image is half the remaining space.
    let marginNeeded = (groupHeight - minRenderedHeight) / 2;
    if (marginNeeded < 0) marginNeeded = 0;

    descWrapper.style.marginTop = `${marginNeeded}px`;
  }

  // Keep it perfectly aligned if the user resizes the window
  window.addEventListener("resize", alignCaptionToImageTop);

  function renderDefaultPanel() {
    // 1. Create a sortable array of items, preserving their original array index
    const sidebarItems = locations.map((loc, index) => {
      // Clean up the title just like the tooltips
      let title = loc.name.includes(":") ? loc.name.split(":")[0].trim() : loc.name;
      
      // If a country exists, format it as "Country, Name". Otherwise, just use "Name".
      let displayName = loc.country ? `${loc.country}, ${title}` : title;
      
      return {
        displayName: displayName,
        originalIndex: index
      };
    });

    // 2. Sort the array alphabetically based on that new Display Name
    sidebarItems.sort((a, b) => a.displayName.localeCompare(b.displayName));

    // 3. Generate the HTML list using the sorted items
    const locationListHtml = sidebarItems.map(item => {
      return `<li class="sidebar-loc-link" data-index="${item.originalIndex}">${item.displayName}</li>`;
    }).join("");

    // 4. Render the panel
    panel.innerHTML = `
      <div style="padding: 0 1.5rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1c1c1c; font-weight: normal; font-size: 1.9rem;">Travel Map</h2>
        <p>Construction in progress!</p>
        
        <h3 style="font-family: var(--font-sans); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-body); border-bottom: 1px solid #ddd; padding-bottom: 0.5rem; margin-bottom: 1rem;">
          Index of Destinations
        </h3>
        <ul style="list-style-type: none; padding-left: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem;">
          ${locationListHtml}
        </ul>
      </div>
    `;

    // 5. Attach click events to every item in the list (Leave your Step 3 code here!)
    // ... (Keep the exact same const links = panel.querySelectorAll('.sidebar-loc-link'); block below this!)

    // 3. Attach click events to every item in the list
    const links = panel.querySelectorAll('.sidebar-loc-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        const targetLocation = locations[idx];
        const targetMarker = targetLocation.markerInstance;

        if (targetMarker) {
          const targetLatLng = targetMarker.getLatLng();
          
          // --- SET DEFAULT ZOOM ---
          let targetZoom = 6; 

          // Ask Leaflet what is currently visible
          const visibleParent = markers.getVisibleParent(targetMarker);

          if (visibleParent && visibleParent !== targetMarker) {
            // MAGIC: Find the exact zoom level where this specific marker breaks out of its cluster!
            if (targetMarker.__parent && typeof targetMarker.__parent._zoom === 'number') {
              const breakZoom = targetMarker.__parent._zoom + 1;
              targetZoom = Math.min(breakZoom, 15);
            } else {
              targetZoom = 15;
            }
          }

          if (targetZoom < 6) targetZoom = 6;
          
          if (map.getZoom() === targetZoom && map.getCenter().equals(targetLatLng)) {
            markers.zoomToShowLayer(targetMarker, () => targetMarker.fire('click'));
            return;
          }

          // --- NEW: DYNAMIC FLIGHT DURATION ---
          // If zooming in past level 10, slow it down to 1.6s for a smoother cinematic dive.
          // Otherwise, stick to the brisk 1.2s flight.
          const flightDuration = targetZoom > 7 ? 1.7 : 1.0;

          // Execute ONE beautiful, continuous flight to the exact necessary zoom
          map.flyTo(targetLatLng, targetZoom, {
            animate: true,
            duration: flightDuration, 
            easeLinearity: 1,
          });

          // Wait for the continuous flight to finish...
          map.once('moveend', () => {
            markers.zoomToShowLayer(targetMarker, () => {
              targetMarker.fire('click');
            });
          });
        }
      });
    });
  }

  function renderPanel(location) {
    const isStacked = location.mode === "stacked";
    const imgCount = location.images ? location.images.length : 0;

    // 1. Build Justified Gallery HTML with Dynamic Overrides
    let justifiedHtml = "";
    if (isStacked && imgCount > 0) {
      if (imgCount === 1) {
        // --- 1. SINGLE IMAGE OVERRIDE ---
        // Adjust this percentage! 82vh means the image will never take up more than 82% of the screen height.
        // Short images will stay their natural size.
        let singleMaxHeight = "81vh";

        justifiedHtml = `
          <div class="justified-gallery single-override">
            <div class="justified-item" data-index="0" style="width: 100%;">
              <img src="${location.images[0].src}" alt="${location.images[0].caption || location.name}" style="width: 100%; height: auto; max-height: ${singleMaxHeight}; object-fit: cover; object-position: center; display: block;">
            </div>
          </div>
        `;
      } else if (imgCount === 2) {
        // --- 2. TWO IMAGES OVERRIDE ---
        // Set your desired minimum height here!
        let targetHeight = "39vh";
        let minHeight = "250px";

        justifiedHtml = `
          <div class="justified-gallery duo-override">
            ${location.images
              .map(
                (img, idx) => `
              <div class="justified-item" data-index="${idx}" style="min-height: ${minHeight};">
                <img src="${img.src}" alt="${img.caption || location.name}">
              </div>
            `,
              )
              .join("")}
          </div>
        `;
      } else if (imgCount === 3) {
        // --- 3. EXACTLY THREE IMAGES ---
        // Slightly taller so the 3 images have room to breathe
        let targetHeight = "39vh";
        let minHeight = "120px";

        justifiedHtml = `
          <div class="justified-gallery">
            ${location.images
              .map(
                (img, idx) => `
              <div class="justified-item" data-index="${idx}" style="height: ${targetHeight}; min-height: ${minHeight};">
                <img src="${img.src}" alt="${img.caption || location.name}">
              </div>
            `,
              )
              .join("")}
          </div>
        `;
      } else if (imgCount === 4) {
        // --- 4. EXACTLY FOUR IMAGES ---
        // Standard grid sizing
        let targetHeight = "25vh";
        let minHeight = "90px";

        justifiedHtml = `
          <div class="justified-gallery">
            ${location.images
              .map(
                (img, idx) => `
              <div class="justified-item" data-index="${idx}" style="height: ${targetHeight}; min-height: ${minHeight};">
                <img src="${img.src}" alt="${img.caption || location.name}">
              </div>
            `,
              )
              .join("")}
          </div>
        `;
      } else {
        // --- 5. FIVE OR MORE IMAGES (Dense Grid) ---
        // Lowered to 12vh! This forces more images per row, stopping the "super wide" stretching.
        let targetHeight = "18vh";
        let minHeight = "60px";

        justifiedHtml = `
          <div class="justified-gallery dense-override">
            ${location.images
              .map(
                (img, idx) => `
              <div class="justified-item" data-index="${idx}" style="height: ${targetHeight}; min-height: ${minHeight};">
                <img src="${img.src}" alt="${img.caption || location.name}">
              </div>
            `,
              )
              .join("")}
          </div>
        `;
      }
    }

    // Check if the name contains a colon, and split it if it does!
    let mainTitle = location.name;
    let subTitle = "";

    if (location.name.includes(":")) {
      const parts = location.name.split(":");
      mainTitle = parts[0].trim();
      subTitle = parts[1].trim();
    }

    // 2. Build the sidebar panel
    panel.innerHTML = `
      <div style="padding: 0 1.5rem;"> <!-- NEW: Master wrapper that adds left/right padding to everything -->
        
        <div style="
          text-align: left; 
          margin-top: -0.75rem;   
          margin-bottom: 0.5rem; 
        ">
          <h2 style="
            margin: 0; 
            color: #1c1c1c; 
            font-weight: normal; 
            white-space: normal;
            font-size: 1.9rem; 
            line-height: 1.1;
          ">${mainTitle}</h2>
          
          ${
            subTitle
              ? `
            <div style="
              font-family: var(--font-sans); 
              font-size: 0.75rem; 
              color: var(--text-body); 
              text-transform: uppercase; 
              letter-spacing: 0.15em; 
              margin-top: 0.9rem;
              margin-bottom: 1.2rem;
              margin-left: 0rem; 
              line-height: 1.2;
            ">${subTitle}</div>
          `
              : ""
          }
        </div>
        
        ${isStacked ? justifiedHtml : ""}
        
      </div> <!-- NEW: Closes the master padding wrapper -->
    `;

    // 3. Post-Render Script for 2-Image Vertical Override
    if (isStacked && imgCount === 2) {
      const duoWrapper = panel.querySelector(".duo-override");
      const imgs = duoWrapper.querySelectorAll("img");

      const applyOrientation = () => {
        // Fallback check to ensure the browser actually sees the dimensions
        if (!imgs[0].naturalWidth || !imgs[1].naturalWidth) return;

        const ratio1 = imgs[0].naturalHeight / imgs[0].naturalWidth;
        const ratio2 = imgs[1].naturalHeight / imgs[1].naturalWidth;

        // 1. Force the wrapper to use CSS Grid instead of Flexbox
        duoWrapper.style.display = "grid";
        duoWrapper.style.gap = "12px";

        if (ratio1 > 1 && ratio2 > 1) {
          // --- BOTH VERTICAL ---
          const minRatio = Math.min(ratio1, ratio2);

          // MATH: If Target Height = 250px, how wide does the image need to be?
          const minWidthPx = 250 / minRatio;

          // Tell the Grid to stack them into 1 column if the screen can't fit both side-by-side
          duoWrapper.style.gridTemplateColumns =
            "repeat(auto-fit, minmax(min(100%, " + minWidthPx + "px), 1fr))";

          // Apply the aspect ratios and let Grid handle the height automatically
          imgs[0].parentElement.style.aspectRatio = "1 / " + minRatio;
          imgs[0].parentElement.style.height = "auto";

          imgs[1].parentElement.style.aspectRatio = "1 / " + minRatio;
          imgs[1].parentElement.style.height = "auto";
        } else {
          // --- NOT BOTH VERTICAL (e.g., Landscape or Mixed) ---

          // Switch to Flexbox for a guaranteed vertical stack
          duoWrapper.style.display = "flex";
          duoWrapper.style.flexDirection = "column";
          duoWrapper.style.gap = "12px";

          // Image 1: Force auto-height so it shrinks proportionally, capped at 39vh
          imgs[0].parentElement.style.width = "100%";
          imgs[0].parentElement.style.height = "auto";
          imgs[0].parentElement.style.minHeight = "0px";

          imgs[0].style.width = "100%";
          imgs[0].style.height = "auto";
          imgs[0].style.maxHeight = "39vh";
          imgs[0].style.objectFit = "cover";

          // Image 2: Exact same constraints
          imgs[1].parentElement.style.width = "100%";
          imgs[1].parentElement.style.height = "auto";
          imgs[1].parentElement.style.minHeight = "0px";

          imgs[1].style.width = "100%";
          imgs[1].style.height = "auto";
          imgs[1].style.maxHeight = "39vh";
          imgs[1].style.objectFit = "cover";
        }
      };

      // Wrap the loading check in a Promise so it strictly waits for physical rendering
      Promise.all(
        Array.from(imgs).map((img) => {
          if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
          return new Promise((resolve) => {
            img.addEventListener("load", resolve);
            img.addEventListener("error", resolve); // Resolves on error so the layout doesn't hang
          });
        }),
      ).then(() => {
        applyOrientation();
      });
    }

    // 4. Hook up Lightbox triggers for every thumbnail
    if (isStacked && imgCount > 0) {
      const galleryItems = panel.querySelectorAll(".justified-item");

      galleryItems.forEach((item) => {
        item.addEventListener("click", () => {
          const idx = parseInt(item.dataset.index, 10);
          openGalleryLightbox(location.images, idx);
        });
      });
    }
  }


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
    showCoverageOnHover: false, // Hides the default bounding box outline
    maxClusterRadius: 30, // Distance in pixels before pins collapse into a circle
    zoomToBoundsOnClick: false, // --- NEW: Disables the default robotic zoom ---
    iconCreateFunction: function (cluster) {
      const count = cluster.getChildCount();
      return L.divIcon({
        html: `<div class="custom-cluster-icon">${count}</div>`,
        className: "", // Prevents Leaflet's default cluster styles from interfering
        iconSize: L.point(36, 36),
      });
    },
  });

  // --- NEW: Controlled "Spread" Zoom ---
  markers.on("clusterclick", function (event) {
    const cluster = event.layer;
    const bounds = cluster.getBounds();
    const targetCenter = bounds.getCenter();

    let currentZoom = map.getZoom();
    let targetZoom = currentZoom;
    const maxZoom = 15; // The absolute maximum you'll allow it to zoom

    // How wide (in pixels) do you want the group of pins to be spread out on screen?
    // 100 is a great starting point for a neat, tight grouping.
    const desiredPixelSpread = 110;

    // Look ahead to find the perfect zoom level to achieve that spread
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

    // Execute the flight directly to the center at our newly calculated, controlled zoom
    map.flyTo(targetCenter, targetZoom, {
      animate: true,
      duration: 1.0,
      easeLinearity: 0.25,
    });
  });

  // 2. Loop through your locations
  locations.forEach((location) => {
    // IMPORTANT: Create the marker, but do NOT chain `.addTo(map)` here!
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

    // Split the title just like in the sidebar
    let hoverTitle = location.name;
    if (location.name.includes(":")) {
      hoverTitle = location.name.split(":")[0].trim();
    }

    // Define the HTML for the tooltip
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

    // Attach it to the Leaflet marker
    marker.bindTooltip(hoverContent, {
      direction: "bottom",
      offset: [0, 5],
      className: "custom-map-tooltip",
      opacity: 1,
    });

    // 3. Handle the click event (Drastically simplified!)
    marker.on("click", () => {
      marker.closeTooltip();

      // Remove color change from the previous marker
      if (activeMarker && activeMarker !== marker) {
        const prevElement = activeMarker.getElement();
        if (prevElement) {
          prevElement.classList.remove("marker-active");
        }
      }

      // Set this marker as active and apply the color-change class
      activeMarker = marker;
      const currentElement = marker.getElement();
      if (currentElement) {
        currentElement.classList.add("marker-active");
      }

      // Render the sidebar
      renderPanel(location);
    });

    // 4. Add the individual marker to the CLUSTER GROUP instead of the map
    markers.addLayer(marker);
  });

  // 5. Finally, add the entire cluster group to the map AFTER the loop finishes
  map.addLayer(markers);

  // 5. Finally, add the entire cluster group to the map AFTER the loop finishes
  map.addLayer(markers);

  // --- NEW PLACEMENT: Render the sidebar now that the pins are ready! ---
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

  setTimeout(() => map.invalidateSize(), 300);
});
