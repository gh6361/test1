window.addEventListener('load', () => {
  const mapEl = document.getElementById('map');
  const panel = document.getElementById('location-panel');

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
      description: 'A first stop in Helsinki with bright light and quiet streets.'
    },
    {
      name: 'Reykjavik',
      coords: [64.1466, -21.9426],
      url: `${baseUrl}/portfolio/reykjavik/`,
      description: 'A cold, bright stop with open skies and coastal views.'
    },
    {
      name: 'Oslo',
      coords: [59.9139, 10.7522],
      url: `${baseUrl}/portfolio/oslo/`,
      description: 'City light, water, and calm Scandinavian streets.'
    }
  ];

  function renderDefaultPanel() {
    panel.innerHTML = `
      <h2>Travel Map</h2>
      <p>Click a marker to see details about each place.</p>
      <p class="map-panel-note">Use the popups to open the gallery pages.</p>
    `;
  }

  function renderPanel(location) {
    panel.innerHTML = `
      <h2>${location.name}</h2>
      <p>${location.description}</p>
      <a href="${location.url}" class="btn btn-sm btn-primary">View Gallery</a>
    `;
  }

  renderDefaultPanel();

  locations.forEach((location) => {
    const marker = L.marker(location.coords).addTo(map);

    marker.bindPopup(`
      <strong>${location.name}</strong><br>
      <a href="${location.url}" class="btn btn-sm btn-primary mt-2">View Gallery</a>
    `);

    marker.on('click', () => {
      renderPanel(location);
    });
  });

  setTimeout(() => map.invalidateSize(), 300);
});