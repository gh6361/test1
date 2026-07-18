document.addEventListener('DOMContentLoaded', () => {

    const helsinki = [60.1699, 24.9384];

    const map = L.map('map').setView(helsinki, 5);

    L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);

    L.marker(helsinki)
        .addTo(map)
        .bindPopup('Hello from Helsinki!');

    setTimeout(() => {
        map.invalidateSize();
    }, 100);

});