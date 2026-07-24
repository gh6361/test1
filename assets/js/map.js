window.addEventListener('load', () => {
  const mapEl = document.getElementById('map');
  const panel = document.getElementById('location-panel');

  const singleLightbox = document.getElementById('single-photo-lightbox');
  const singleImage = document.getElementById('single-photo-image');
  const singleClose = document.getElementById('single-photo-close');
  
  // Timer variable for the fading close button
  let singleUiTimer = null;

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
      url: `${baseUrl}/portfolio/reykjavik/`,
      description: 'A cold, bright stop with open skies and coastal views.',
      previewImage: `${baseUrl}/assets/images/reykjavik/cover.jpg`,
      mode: 'gallery'
    },
    {
      name: 'Oslo',
      coords: [59.9139, 10.7522],
      description: 'City light, water, and calm Scandinavian streets.',
      previewImage: `${baseUrl}/assets/images/oslo/cover.jpg`,
      mode: 'single'
    }
  ];

  // Function to handle waking up and fading the UI
  function showSingleUi() {
    if (!singleLightbox) return;
    singleLightbox.classList.add('show-ui');
    clearTimeout(singleUiTimer);
    
    // Hide the 'X' button after 2 seconds (2000ms) of inactivity
    singleUiTimer = window.setTimeout(() => {
      if (!singleLightbox.classList.contains('hidden')) {
        singleLightbox.classList.remove('show-ui');
      }
    }, 2000); 
  }

  function openSinglePhoto(imageUrl, altText) {
    if (!singleLightbox || !singleImage) return;
    singleImage.src = imageUrl;
    singleImage.alt = altText || '';
    singleLightbox.classList.remove('hidden');
    showSingleUi(); // Wake up the 'X' button immediately
  }

  function closeSinglePhoto() {
    if (!singleLightbox || !singleImage) return;
    singleLightbox.classList.add('hidden');
    singleLightbox.classList.remove('show-ui');
    clearTimeout(singleUiTimer); // Stop the timer
    singleImage.src = '';
    singleImage.alt = '';
  }

  function renderDefaultPanel() {
    panel.innerHTML = `
      <h2>Travel Map</h2>
      <p>Click a marker to see details about each place.</p>
      <p class="map-panel-note">Use the buttons to open a gallery or a single photo.</p>
    `;
  }

  function renderPanel(location) {
    const isSingle = location.mode === 'single';

    panel.innerHTML = `
    ${location.previewImage
        ? `
          <button type="button" class="location-preview-button" aria-label="Open preview">
            <img class="location-image" src="${location.previewImage}" alt="${location.name}">
          </button>
        `
        : ''
      }
    <h2>${location.name}</h2>
    <p>${location.description}</p>
    ${isSingle
        ? '<p class="map-panel-note">Click the preview to open the photo.</p>'
        : `<a href="${location.url}" class="btn btn-sm btn-primary">View Gallery</a>`
      }
  `;

    const previewButton = panel.querySelector('.location-preview-button');

    if (previewButton) {
      previewButton.addEventListener('click', () => {
        if (isSingle) {
          openSinglePhoto(location.previewImage, location.name);
        } else {
          window.location.href = location.url;
        }
      });
    }
  }

  renderDefaultPanel();

  locations.forEach((location) => {
    const marker = L.marker(location.coords).addTo(map);

    if (location.mode === 'single') {
      marker.bindPopup(`
      <strong>${location.name}</strong><br>
      <button type="button" class="btn btn-sm btn-primary mt-2 popup-open-photo">
        View Photo
      </button>
    `);

      marker.on('popupopen', () => {
        const popupEl = marker.getPopup().getElement();
        const btn = popupEl ? popupEl.querySelector('.popup-open-photo') : null;

        if (btn) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            openSinglePhoto(location.previewImage, location.name);
          });
        }
      });
    } else {
      marker.bindPopup(`
      <strong>${location.name}</strong><br>
      <a href="${location.url}" class="btn btn-sm btn-primary mt-2">
        View Gallery
      </a>
    `);
    }

    marker.on('click', () => {
      renderPanel(location);
    });
  });
  
  if (singleClose) {
    singleClose.addEventListener('click', closeSinglePhoto);
  }

  if (singleLightbox) {
    // Wake up the 'X' button whenever the mouse moves
    singleLightbox.addEventListener('mousemove', showSingleUi);

    singleLightbox.addEventListener('click', (event) => {
      if (event.target === singleLightbox) {
        closeSinglePhoto();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSinglePhoto();
    }
  });

  setTimeout(() => map.invalidateSize(), 300);
});