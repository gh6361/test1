window.addEventListener('load', () => {
  const mapEl = document.getElementById('map');
  const panel = document.getElementById('location-panel');

  // Standard Gallery Lightbox Elements
  const galOverlay = document.getElementById('lightbox');
  const galStage = document.getElementById('lightbox-stage');
  const galImageA = document.getElementById('lightbox-image-a');
  const galImageB = document.getElementById('lightbox-image-b');
  const galClose = document.getElementById('lightbox-close');
  const galPanelToggle = document.getElementById('lightbox-panel-toggle');
  const galPrev = document.getElementById('lightbox-prev');
  const galNext = document.getElementById('lightbox-next');
  const galLeftZone = document.getElementById('lightbox-left-zone');
  const galRightZone = document.getElementById('lightbox-right-zone');
  const galCaption = document.getElementById('lightbox-caption');

  let galImages = [];
  let galCurrentIndex = 0;
  let galActive = galImageA;
  let galInactive = galImageB;
  let galUiTimer = null;
  const UI_HIDE_DELAY = 1500;

  if (!mapEl || !panel || typeof L === 'undefined') return;

  const map = L.map(mapEl).setView([54, 15], 4);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const baseUrl = window.siteBaseUrl || '';

  const locations = [
    {
      name: 'Helsinki',
      coords: [60.1699, 24.9384],
      url: `${baseUrl}/portfolio/helsinki/`,
      description: 'A first stop in Helsinki with bright light and quiet streets.',
      previewImage: `${baseUrl}/assets/images/helsinki/cover.jpg`,
      mode: 'gallery'
    },
    {
      name: 'Reykjavik',
      coords: [64.1466, -21.9426],
      description: 'A cold, bright stop with open skies and coastal views.',
      mode: 'stacked',
      images: [
        { src: `${baseUrl}/assets/images/reykjavik/slowducks.jpg`, caption: 'Open skies over Reykjavik.' },
        { src: `${baseUrl}/assets/images/reykjavik/pig.jpg`, caption: 'Coastal architecture details.' },
        { src: `${baseUrl}/assets/images/reykjavik/revolte.jpg`, caption: 'Cold bright streets at dusk.' }
      ]
    },
    {
      name: 'Oslo',
      coords: [59.9139, 10.7522],
      description: 'City light, water, and calm Scandinavian streets.',
      mode: 'stacked',
      images: [
        // Just one image triggers "Single Mode" automatically!
        { src: `${baseUrl}/assets/images/oslo/cover.jpg`, caption: 'Calm Scandinavian streets.' } 
      ]
    }
  ];

  /* --- GALLERY LIGHTBOX LOGIC --- */
  function showGalUi() {
    if (!galOverlay) return;
    galOverlay.classList.add('show-ui');
    clearTimeout(galUiTimer);
    galUiTimer = window.setTimeout(() => {
      // In single-mode, it behaves like fullscreen
      if (!galOverlay.classList.contains('hidden') && (galOverlay.classList.contains('fullscreen') || galOverlay.classList.contains('single-mode'))) {
        galOverlay.classList.remove('show-ui');
      }
    }, UI_HIDE_DELAY);
  }

  function hideGalUi() {
    if (!galOverlay) return;
    galOverlay.classList.remove('show-ui');
    clearTimeout(galUiTimer);
  }

  function swapGalImages() {
    [galActive, galInactive] = [galInactive, galActive];
  }

  function renderGalImage(index) {
    if (!galImages.length || !galInactive || !galActive) return;
    galCurrentIndex = (index + galImages.length) % galImages.length;
    const item = galImages[galCurrentIndex];

    if (galCaption) galCaption.textContent = item.caption || '';
    galInactive.src = item.src;
    galInactive.alt = item.caption || `Image ${galCurrentIndex + 1}`;

    galOverlay.classList.remove('hidden');

    requestAnimationFrame(() => {
      galActive.classList.remove('active');
      galInactive.classList.add('active');
      swapGalImages();
    });
  }

  function openGalleryLightbox(images, startIndex) {
    if (!galOverlay) return;
    galImages = images;
    
    // Automatically apply Single Mode if there is only 1 image
    if (images.length <= 1) {
      galOverlay.classList.add('single-mode', 'fullscreen');
      galOverlay.classList.remove('panel-open', 'hidden');
    } else {
      galOverlay.classList.remove('single-mode', 'fullscreen', 'hidden');
      galOverlay.classList.add('panel-open');
    }
    
    hideGalUi();
    renderGalImage(startIndex || 0);
  }

  function closeGalleryLightbox() {
    if (!galOverlay) return;
    galOverlay.classList.add('hidden');
    galOverlay.classList.remove('fullscreen', 'show-ui', 'panel-open', 'single-mode');
    hideGalUi();
    
    if (galImageA) galImageA.src = '';
    if (galImageB) galImageB.src = '';
    if (galCaption) galCaption.textContent = '';
    galImages = [];
  }

  function toggleGalFullscreen() {
    if (!galOverlay || galImages.length <= 1) return; // Disable toggle in single mode
    
    if (galOverlay.classList.contains('fullscreen')) {
      galOverlay.classList.remove('fullscreen');
      galOverlay.classList.add('panel-open');
    } else {
      galOverlay.classList.add('fullscreen');
      galOverlay.classList.remove('panel-open');
    }
    showGalUi();
  }

  function nextGalImage() {
    if (galImages.length <= 1) return;
    renderGalImage(galCurrentIndex + 1);
    if (galOverlay.classList.contains('fullscreen')) showGalUi();
  }

  function prevGalImage() {
    if (galImages.length <= 1) return;
    renderGalImage(galCurrentIndex - 1);
    if (galOverlay.classList.contains('fullscreen')) showGalUi();
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
    const isStacked = location.mode === 'stacked';

    // Build stacked images HTML
    let stackedHtml = '';
    if (isStacked && location.images) {
      stackedHtml = `
        <div class="stacked-gallery">
          ${location.images.map((img, idx) => `
            <button type="button" class="stacked-image-btn" data-index="${idx}">
              <img src="${img.src}" alt="${img.caption}">
            </button>
          `).join('')}
        </div>
      `;
    }

    // Build the sidebar panel
    panel.innerHTML = `
    ${(!isStacked && location.previewImage)
        ? `
          <button type="button" class="location-preview-button" aria-label="Open preview">
            <img class="location-image" src="${location.previewImage}" alt="${location.name}">
          </button>
        `
        : ''
      }
    <h2>${location.name}</h2>
    <p>${location.description}</p>
    
    ${location.mode === 'gallery' ? `<a href="${location.url}" class="btn btn-sm btn-primary">View Gallery</a>` : ''}
    ${isStacked ? stackedHtml : ''}
  `;

    // Hook up Stacked mode buttons
    if (isStacked) {
      const stackedButtons = panel.querySelectorAll('.stacked-image-btn');
      stackedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index, 10);
          openGalleryLightbox(location.images, idx);
        });
      });
    }
  }

  renderDefaultPanel();

  locations.forEach((location) => {
    const marker = L.marker(location.coords).addTo(map);

    if (location.mode === 'stacked') {
      // Grammatically adjust popup text based on number of photos
      const btnText = (location.images && location.images.length === 1) ? 'View Photo' : 'View Photos';
      marker.bindPopup(`
      <strong>${location.name}</strong><br>
      <button type="button" class="btn btn-sm btn-primary mt-2 popup-open-stacked">${btnText}</button>
      `);
      marker.on('popupopen', () => {
        const popupEl = marker.getPopup().getElement();
        const btn = popupEl ? popupEl.querySelector('.popup-open-stacked') : null;
        if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); renderPanel(location); });
      });
    } else {
      marker.bindPopup(`
      <strong>${location.name}</strong><br>
      <a href="${location.url}" class="btn btn-sm btn-primary mt-2">View Gallery</a>
      `);
    }

    marker.on('click', () => renderPanel(location));
  });
  
  /* --- EVENT LISTENERS --- */
  if (galOverlay) {
    galOverlay.addEventListener('mousemove', () => {
      if (!galOverlay.classList.contains('hidden') && (galOverlay.classList.contains('fullscreen') || galOverlay.classList.contains('single-mode'))) {
        showGalUi();
      }
    });
    
    if (galStage) galStage.addEventListener('click', () => {
      if (galOverlay.classList.contains('hidden')) return;
      if (galImages.length > 1) {
        toggleGalFullscreen();
      } else {
        showGalUi(); // Just wake up the UI for single mode
      }
    });

    if (galPanelToggle) galPanelToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleGalFullscreen(); });
    
    if (galPrev) galPrev.addEventListener('click', (e) => { e.stopPropagation(); prevGalImage(); });
    if (galNext) galNext.addEventListener('click', (e) => { e.stopPropagation(); nextGalImage(); });
    if (galLeftZone) galLeftZone.addEventListener('click', (e) => { e.stopPropagation(); prevGalImage(); });
    if (galRightZone) galRightZone.addEventListener('click', (e) => { e.stopPropagation(); nextGalImage(); });
    if (galClose) galClose.addEventListener('click', closeGalleryLightbox);
  }

  document.addEventListener('keydown', (event) => {
    if (!galOverlay?.classList.contains('hidden')) {
      if (event.key === 'ArrowLeft') prevGalImage();
      if (event.key === 'ArrowRight') nextGalImage();
      if (event.key === 'Escape') closeGalleryLightbox();
    }
  });

  setTimeout(() => map.invalidateSize(), 300);
});