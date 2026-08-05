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

    return div;
  };

  regionControl.addTo(map);

  const baseUrl = window.siteBaseUrl || "";

  const locations = [
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
          src: `${baseUrl}/assets/images/reykjavik/revolte.jpg`,
          caption: "Cold bright streets at dusk.",
        },
        {
          src: `${baseUrl}/assets/images/reykjavik/pig.jpg`,
          caption: "Coastal architecture details.",
        },
      ],
    },
    {
      name: "Helsinki",
      coords: [60.1699, 24.9384],
      description: "A cold, bright stop with open skies and coastal views.",
      mode: "stacked",
      images: [
        {
          src: `${baseUrl}/assets/images/reykjavik/slowducks.jpg`,
          caption: "Open skies over Reykjavik.",
        },
        {
          src: `${baseUrl}/assets/images/reykjavik/revolte.jpg`,
          caption: "Cold bright streets at dusk.",
        },
      ],
    },
    {
      name: "Berlin",
      coords: [52.5200, 13.4050],
      description: "A cold, bright stop with open skies and coastal views.",
      mode: "stacked",
      images: [
        {
          src: `${baseUrl}/assets/images/helsinki/snowman.jpg`,
          caption: "Open skies over Reykjavik.",
        },
        {
          src: `${baseUrl}/assets/images/helsinki/bread.jpg`,
          caption: "Cold bright streets at dusk.",
        },
      ],
    },
    {
      name: "Stockholm",
      coords: [59.33, 18.06],
      description: "Köttbullar och kanelbulle.",
      mode: "stacked",
      images: [
        {
          src: `${baseUrl}/assets/images/helsinki/bread.jpg`,
          caption: "Open skies over Reykjavik.",
        },
        {
          src: `${baseUrl}/assets/images/helsinki/cricket.jpg`,
          caption: "Coastal architecture details.",
        },
        {
          src: `${baseUrl}/assets/images/helsinki/snowman.jpg`,
          caption: "Cold bright streets at dusk.",
        },
        {
          src: `${baseUrl}/assets/images/helsinki/popquiz.jpg`,
          caption: "Cold bright streets at dusk.",
        },
        {
          src: `${baseUrl}/assets/images/helsinki/rights.jpg`,
          caption: "Cold bright streets at dusk.",
        },
        {
          src: `${baseUrl}/assets/images/helsinki/round.jpg`,
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
        {
          src: `${baseUrl}/assets/images/oslo/cover.jpg`,
          caption: "Calm Scandinavian streets.",
        },
      ],
    },
    {
      name: "Copenhagen",
      coords: [55.6761, 12.5683],
      description: "City light, water, and calm Scandinavian streets.",
      mode: "stacked",
      images: [
        {
          src: `${baseUrl}/assets/images/helsinki/waltz.jpg`,
          caption: "Calm Scandinavian streets.",
        },
      ],
    },
  ];

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
        justifiedHtml = `
          <div class="justified-gallery single-override">
            <div class="justified-item" data-index="0">
              <img src="${location.images[0].src}" alt="${location.images[0].caption || location.name}">
            </div>
          </div>
        `;
      } else if (imgCount === 2) {
        // --- 2. TWO IMAGES OVERRIDE ---
        justifiedHtml = `
          <div class="justified-gallery duo-override">
            ${location.images.map((img, idx) => `
              <div class="justified-item" data-index="${idx}">
                <img src="${img.src}" alt="${img.caption || location.name}">
              </div>
            `).join("")}
          </div>
        `;
      } else if (imgCount === 3) {
        // --- 3. EXACTLY THREE IMAGES ---
        // Slightly taller so the 3 images have room to breathe
        let targetHeight = "39vh"; 
        let minHeight = "150px";
        
        justifiedHtml = `
          <div class="justified-gallery">
            ${location.images.map((img, idx) => `
              <div class="justified-item" data-index="${idx}" style="height: ${targetHeight}; min-height: ${minHeight};">
                <img src="${img.src}" alt="${img.caption || location.name}">
              </div>
            `).join("")}
          </div>
        `;
      } else {
        // --- 4. FOUR OR MORE IMAGES (Standard Justified Grid) ---
        // Tighter grid for easier scrolling through many photos
        let targetHeight = "26vh"; 
        let minHeight = "100px";
        
        justifiedHtml = `
          <div class="justified-gallery">
            ${location.images.map((img, idx) => `
              <div class="justified-item" data-index="${idx}" style="height: ${targetHeight}; min-height: ${minHeight};">
                <img src="${img.src}" alt="${img.caption || location.name}">
              </div>
            `).join("")}
          </div>
        `;
      }
    }

    // 2. Build the sidebar panel
    panel.innerHTML = `
      <h2 style="
        margin-top: 0; 
        color: #1c1c1c; 
        font-weight: normal; /* 1. Removes the bold font */
        width: max-content; /* Shrink-wraps the container to the text size */
        position: relative; 
        left: 26%; /* Pushes the left edge to 38.2% of the photo width */
        transform: translateX(-50%); /* 2. Pulls it back half its length to center it */
      ">${location.name}</h2>
      
      ${isStacked ? justifiedHtml : ""}
    `;

    // 3. Post-Render Script for 2-Image Vertical Override (Syntax Error Fixed!)
    if (isStacked && imgCount === 2) {
      const duoWrapper = panel.querySelector('.duo-override');
      const imgs = duoWrapper.querySelectorAll('img');
      let loadedCount = 0;
      
      const checkOrientation = () => {
        loadedCount++;
        if (loadedCount === 2) {
          const ratio1 = imgs[0].naturalHeight / imgs[0].naturalWidth;
          const ratio2 = imgs[1].naturalHeight / imgs[1].naturalWidth;
          
          if (ratio1 > 1 && ratio2 > 1) {
            duoWrapper.classList.add('duo-vertical');
            const minRatio = Math.min(ratio1, ratio2);
            
            // FIXED: Removed the errant escape backslashes here!
            imgs[0].parentElement.style.aspectRatio = `1 / ${minRatio}`;
            imgs[1].parentElement.style.aspectRatio = `1 / ${minRatio}`;
          } else {
            imgs[0].parentElement.style.height = "39vh";
            imgs[0].parentElement.style.minHeight = "200px";
            imgs[1].parentElement.style.height = "39vh";
            imgs[1].parentElement.style.minHeight = "200px";
          }
        }
      };

      imgs.forEach(img => {
        if (img.complete) {
          checkOrientation();
        } else {
          img.addEventListener('load', checkOrientation);
        }
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

    const hoverContent = `
      <div class="map-hover-card">
        ${tooltipImageSrc ? `<img src="${tooltipImageSrc}" alt="${location.name}">` : ""}
        <div class="map-hover-title">${location.name}</div>
      </div>
    `;

    marker.bindTooltip(hoverContent, {
      direction: "bottom", 
      offset: [0, 5], 
      className: "custom-map-tooltip",
      opacity: 1,
    });

    marker.on("click", () => {
      marker.closeTooltip();
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