// Import the combined locations array from your hub file
import { locations } from '../data/index.js';

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
      [-60, -170],
      [78, 180],
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

  // Initialize map with default zoom control disabled, and fit to 'world' bounds
  const map = L.map(mapEl, {
    zoomControl: false,
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
        const links = image.collections.map(c => `<a href="${c.url}">${c.name}</a>`).join(", ");
        collectionsHTML = `In collections: ${links}`;
      }

      // NEW: Only show the index counter if there is more than 1 image
      let indexHtml = "";
      if (galImages.length > 1) {
        indexHtml = `<div class="caption-index">${galCurrentIndex + 1} / ${galImages.length}</div>`;
      }

      galCaption.innerHTML = `
        ${indexHtml} <!-- Injected right above the main title -->
        
        <div class="caption-main">${image.caption || ""}</div>
        
        <div class="caption-meta">
          ${image.location ? `<div>${image.location}</div>` : ""}
          ${image.date ? `<div>${image.date}</div>` : ""}
        </div>
        
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
    });
  }

  function openGalleryLightbox(images, startIndex) {
    if (!galOverlay) return;
    galImages = images;

    // --- HIDE THE NAVBAR ---
    const siteNav = document.querySelector(".editorial-header");
    if (siteNav) siteNav.style.display = "none";

    // Set single-mode if needed
    if (images.length <= 1) {
      galOverlay.classList.add("single-mode");
    } else {
      galOverlay.classList.remove("single-mode");
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

  /* --- MAP UI LOGIC --- */
  function renderDefaultPanel() {
    panel.innerHTML = `
      <h2>Travel Map</h2>
      <p>Click a marker to see details about each place.</p>
      <p class="map-panel-note">Use the buttons to open a gallery or a single photo.</p>
    `;
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
        let targetHeight = "16vh"; 
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
      <div style="
        position: relative; 
        left: 26%; 
        transform: translateX(-50%); 
        width: max-content; 
        max-width: 90%; 
        text-align: center; 
        margin-top: -0.75rem;   /* 1. DECREASED space above the main title */
        margin-bottom: 0rem;
      ">
        <h2 style="
          margin: 0; 
          color: #1c1c1c; 
          font-weight: normal; 
          white-space: normal;
          font-size: 1.9rem; /* 1. Decreased main title font size */
        ">${mainTitle}</h2>
        
        ${subTitle ? `
          <div style="
            font-family: var(--font-sans); 
            font-size: 0.75rem; 
            color: var(--text-body); 
            text-transform: uppercase; 
            letter-spacing: 0.15em; 
            margin-top: 0.5rem;
            transform: translateX(11.8%); /* 2. Shifts the subtitle so its 38.2% mark is dead center */
          ">${subTitle}</div>
        ` : ""}
      </div>
      
      ${isStacked ? justifiedHtml : ""}
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

  renderDefaultPanel();

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

  // 1. Keep track of the currently selected marker globally
  let activeMarker = null;

  locations.forEach((location) => {
    const marker = L.marker(location.coords, { icon: smallIcon }).addTo(map);

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

    // --- NEW: Split the title just like we did in the sidebar! ---
    let hoverTitle = location.name;
    if (location.name.includes(":")) {
      hoverTitle = location.name.split(":")[0].trim();
    }

    // 2. Define the HTML for the tooltip
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
    
    // 3. Attach it to the Leaflet marker
    marker.bindTooltip(hoverContent, {
      direction: "bottom",
      offset: [0, 5],
      className: "custom-map-tooltip",
      opacity: 1, 
    });

    // 4. Handle the click event (manages color change and sidebar)
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

      // --- DYNAMIC OVERLAP DETECTION ---
      let closestDistance = Infinity;
      let closestLocation = null;

      locations.forEach((otherLoc) => {
        if (otherLoc !== location) {
          const dist = map.distance(location.coords, otherLoc.coords);
          if (dist < closestDistance) {
            closestDistance = dist;
            closestLocation = otherLoc;
          }
        }
      });

      let currentZoom = map.getZoom();
      let targetZoom = currentZoom;

      if (closestLocation) {
        const minPixelSeparation = 20; 
        const maxZoom = map.getMaxZoom() || 16; 

        for (let z = currentZoom; z <= maxZoom; z++) {
          const p1 = map.project(location.coords, z);
          const p2 = map.project(closestLocation.coords, z);
          const pixelDist = p1.distanceTo(p2);

          if (pixelDist >= minPixelSeparation) {
            targetZoom = z;
            break; 
          }
          if (z === maxZoom) targetZoom = maxZoom; 
        }
      }

      // --- NEW: FLY, BUT DON'T CENTER! ---
      if (targetZoom > currentZoom) {
        // 1. Where is the marker on the screen right now?
        const markerScreenPoint = map.latLngToContainerPoint(location.coords);
        
        // 2. Where is the center of the screen?
        const mapSize = map.getSize();
        const centerScreenPoint = L.point(mapSize.x / 2, mapSize.y / 2);
        
        // 3. What is the pixel difference between the marker and the center?
        const offset = centerScreenPoint.subtract(markerScreenPoint);
        
        // 4. Calculate where the marker WILL be at the new zoom level (absolute map pixels)
        const targetMarkerPixel = map.project(location.coords, targetZoom);
        
        // 5. Shift the target center by our offset to keep the marker locked in its screen position
        const targetCenterPixel = targetMarkerPixel.add(offset);
        
        // 6. Convert those perfect pixels back into GPS coordinates
        const targetCenterLatLng = map.unproject(targetCenterPixel, targetZoom);
        
        // 7. Execute the flight to the offset center!
        map.flyTo(targetCenterLatLng, targetZoom, {
          animate: true,
          duration: 1.8
        });
      }

      // Render the sidebar
      renderPanel(location);
    });
  });

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
