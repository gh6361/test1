window.addEventListener("load", () => {
  const mapEl = document.getElementById("map");
  const panel = document.getElementById("location-panel");

  // PREVENT DOUBLE INITIALIZATION ERROR
  if (mapEl && mapEl._leaflet_id) {
    return;
  }

  // Standard Gallery Lightbox Elements
  const galOverlay = document.getElementById("lightbox");
  const galStage = document.getElementById("lightbox-stage");
  const galImageA = document.getElementById("lightbox-image-a");
  const galImageB = document.getElementById("lightbox-image-b");
  const galClose = document.getElementById("lightbox-close");
  const galPanelToggle = document.getElementById("lightbox-panel-toggle");
  const galPrev = document.getElementById("lightbox-prev");
  const galNext = document.getElementById("lightbox-next");
  const galLeftZone = document.getElementById("lightbox-left-zone");
  const galRightZone = document.getElementById("lightbox-right-zone");
  const galCaption = document.getElementById("lightbox-caption");

  let galImages = [];
  let galCurrentIndex = 0;
  let galActive = galImageA;
  let galInactive = galImageB;
  let galUiTimer = null;
  const UI_HIDE_DELAY = 2500;

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
  // Carto Voyager - Muted, earthy daytime map
  // Carto Positron - Clean, monochromatic light grey/linen map
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

    return div;
  };

  regionControl.addTo(map);

  const baseUrl = window.siteBaseUrl || "";

  const locations = [
    {
      name: "Helsinki",
      coords: [60.1699, 24.9384],
      url: `${baseUrl}/portfolio/helsinki/`,
      description:
        "A first stop in Helsinki with bright light and quiet streets.",
      previewImage: `${baseUrl}/assets/images/helsinki/cover.jpg`,
      mode: "gallery",
    },
    {
      name: "Reykjavik",
      coords: [64.1466, -21.9426],
      description: "A cold, bright stop with open skies and coastal views.",
      mode: "stacked",
      images: [
        {
          src: `${baseUrl}/assets/images/reykjavik/slowducks.jpg`,
          caption: "Open skies over Reykjavik.",
        },
        {
          src: `${baseUrl}/assets/images/reykjavik/pig.jpg`,
          caption: "Coastal architecture details.",
        },
        {
          src: `${baseUrl}/assets/images/reykjavik/revolte.jpg`,
          caption: "Cold bright streets at dusk.",
        },
      ],
    },
    {
      name: "Oslo",
      coords: [59.9139, 10.7522],
      description: "City light, water, and calm Scandinavian streets.",
      mode: "stacked",
      images: [
        // Just one image triggers "Single Mode" automatically!
        {
          src: `${baseUrl}/assets/images/oslo/cover.jpg`,
          caption: "Calm Scandinavian streets.",
        },
      ],
    },
  ];

  function showGalUi() {
    if (!galOverlay) return;

    // Wake up the UI
    galOverlay.classList.add("show-ui");
    clearTimeout(galUiTimer);

    // Start the inactivity countdown
    galUiTimer = window.setTimeout(() => {
      // If the lightbox is still open, fade out the UI (caption, arrows, close button)
      if (!galOverlay.classList.contains("hidden")) {
        galOverlay.classList.remove("show-ui");
      }
    }, UI_HIDE_DELAY);
  }

  function hideGalUi() {
    if (!galOverlay) return;
    galOverlay.classList.remove("show-ui");
    clearTimeout(galUiTimer);
  }

  function swapGalImages() {
    [galActive, galInactive] = [galInactive, galActive];
  }

  function renderGalImage(index) {
    if (!galImages.length || !galInactive || !galActive) return;
    galCurrentIndex = (index + galImages.length) % galImages.length;
    const item = galImages[galCurrentIndex];

    if (galCaption) galCaption.textContent = item.caption || "";
    galInactive.src = item.src;
    galInactive.alt = item.caption || `Image ${galCurrentIndex + 1}`;

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

    // 1. Set single-mode if needed
    if (images.length <= 1) {
      galOverlay.classList.add("single-mode");
    } else {
      galOverlay.classList.remove("single-mode");
    }

    // 2. ALWAYS add fullscreen and remove old panel classes
    galOverlay.classList.add("fullscreen");
    galOverlay.classList.remove("panel-open", "hidden");

    // CHANGED: Tell the UI to wake up (instead of hide) when the gallery opens
    showGalUi();

    renderGalImage(startIndex || 0);
  }

  function closeGalleryLightbox() {
    if (!galOverlay) return;
    galOverlay.classList.add("hidden");
    galOverlay.classList.remove(
      "fullscreen",
      "show-ui",
      "panel-open",
      "single-mode",
    );
    hideGalUi();

    if (galImageA) galImageA.src = "";
    if (galImageB) galImageB.src = "";
    if (galCaption) galCaption.textContent = "";
    galImages = [];

    // --- BRING THE NAVBAR BACK ---
    const siteNav = document.querySelector(".editorial-header");
    if (siteNav) siteNav.style.display = "";
  }

  function toggleGalFullscreen() {
    if (!galOverlay || galImages.length <= 1) return; // Disable toggle in single mode

    if (galOverlay.classList.contains("fullscreen")) {
      galOverlay.classList.remove("fullscreen");
      galOverlay.classList.add("panel-open");
    } else {
      galOverlay.classList.add("fullscreen");
      galOverlay.classList.remove("panel-open");
    }
    showGalUi();
  }

  function nextGalImage() {
    if (galImages.length <= 1) return;
    renderGalImage(galCurrentIndex + 1);
    if (galOverlay.classList.contains("fullscreen")) showGalUi();
  }

  function prevGalImage() {
    if (galImages.length <= 1) return;
    renderGalImage(galCurrentIndex - 1);
    if (galOverlay.classList.contains("fullscreen")) showGalUi();
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

    // 1. Build Masonry Gallery HTML
    let masonryHtml = "";
    if (isStacked && location.images && location.images.length > 0) {
      // Dynamic columns based on image count
      const colCount = location.images.length === 1 ? 1 : 2; 
      
      masonryHtml = `
        <div class="masonry-gallery" style="column-count: ${colCount};">
          ${location.images.map((img, idx) => `
            <div class="masonry-item" data-index="${idx}">
              <img src="${img.src}" alt="${img.caption || location.name}">
            </div>
          `).join("")}
        </div>
      `;
    }

    // 2. Build the sidebar panel (Just Name + Masonry Grid!)
    panel.innerHTML = `
      <h2 style="margin-top: 0; color: #1c1c1c;">${location.name}</h2>
      ${isStacked ? masonryHtml : ""}
    `;

    // 3. Hook up Lightbox triggers for every masonry thumbnail
    if (isStacked && location.images) {
      const masonryItems = panel.querySelectorAll(".masonry-item");
      
      masonryItems.forEach((item) => {
        item.addEventListener("click", () => {
          const idx = parseInt(item.dataset.index, 10);
          openGalleryLightbox(location.images, idx);
        });
      });
    }
  }

  renderDefaultPanel();

  /* --- MARKER & TOOLTIP LOGIC --- */

  // Define a smaller version of Leaflet's default blue pin
  const smallIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [20, 32], // Scaled down from the default 25x41
    iconAnchor: [10, 32], // Anchors the very bottom tip to the coordinates
    shadowSize: [32, 32],
    shadowAnchor: [10, 32],
    className: "interactive-marker", // We will use this class in CSS for the hover effect
  });

  locations.forEach((location) => {
    // Pass the custom smallIcon to the marker
    const marker = L.marker(location.coords, { icon: smallIcon }).addTo(map);

    // Grab the appropriate cover image for the tooltip
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

    // 1. Build the HTML for the hover card
    const hoverContent = `
      <div class="map-hover-card">
        ${tooltipImageSrc ? `<img src="${tooltipImageSrc}" alt="${location.name}">` : ""}
        <div class="map-hover-title">${location.name}</div>
      </div>
    `;

    // 2. Bind it as a Tooltip
    marker.bindTooltip(hoverContent, {
      direction: "bottom", // Switched to appear BELOW the marker
      offset: [0, 5], // Pushes the tooltip 5px below the tip of the pin
      className: "custom-map-tooltip",
      opacity: 1,
    });

    // 3. Handle the click event to close tooltip and open sidebar
    marker.on("click", () => {
      marker.closeTooltip();
      renderPanel(location);
    });
  });

  /* --- EVENT LISTENERS --- */
  if (galOverlay) {
    galOverlay.addEventListener("mousemove", () => {
      if (
        !galOverlay.classList.contains("hidden") &&
        (galOverlay.classList.contains("fullscreen") ||
          galOverlay.classList.contains("single-mode"))
      ) {
        showGalUi();
      }
    });

    if (galStage)
      galStage.addEventListener("click", () => {
        if (galOverlay.classList.contains("hidden")) return;
        // Clicking the stage just wakes up the UI now, it doesn't force a layout shift
        showGalUi();
      });

    if (galPanelToggle)
      galPanelToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        // Removed toggleGalFullscreen() - the panel is now pure hover-based!
      });

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
    if (galLeftZone)
      galLeftZone.addEventListener("click", (e) => {
        e.stopPropagation();
        prevGalImage();
      });
    if (galRightZone)
      galRightZone.addEventListener("click", (e) => {
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
