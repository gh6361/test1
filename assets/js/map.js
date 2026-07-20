window.addEventListener('load', () => {
  const map = L.map('map').setView([54, 15], 4);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const baseUrl = window.siteBaseUrl || '';

const locations = [
  {
    name: 'Helsinki',
    coords: [60.1699, 24.9384],
    url: `${baseUrl}/portfolio/helsinki/`
  },
  {
    name: 'Reykjavik',
    coords: [64.1466, -21.9426],
    url: `${baseUrl}/portfolio/reykjavik/`
  },
  {
    name: 'Oslo',
    coords: [59.9139, 10.7522],
    url: `${baseUrl}/portfolio/oslo/`
  }
];

  for (const location of locations) {
    const popupHtml = `
      <strong>${location.name}</strong><br>
      <a href="${location.url}" class="btn btn-sm btn-primary mt-2">View Gallery</a>
    `;

    L.marker(location.coords)
      .addTo(map)
      .bindPopup(popupHtml);
  }

  setTimeout(() => map.invalidateSize(), 300);
});