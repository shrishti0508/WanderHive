// Parse coordinates from data attribute
var listingCoordinates = JSON.parse(document.getElementById('map').dataset.coordinates);

// Initialize the map
var map = L.map('map').setView([listingCoordinates[1], listingCoordinates[0]], 13);

// Set up OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Define a custom red marker icon
var redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create a draggable red marker
var marker = L.marker([listingCoordinates[1], listingCoordinates[0]], { 
  icon: redIcon,
  draggable: true
}).addTo(map);

// Bind popup to the marker
marker.bindPopup("<b>Drag me!</b><br>We are here!!").openPopup();

