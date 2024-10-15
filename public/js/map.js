

mapboxgl.accessToken=mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style:"mapbox://styles/mapbox/streets-v12",
center: [77.5946,12.9716], // starting position [lng, lat]. Note that lat must be set between -90 and 90
zoom: 9 // starting zoom
});

console.log(coordinates);
  // Create a default Marker and add it to the map.
//   const marker1 = new mapboxgl.Marker()
//   .setLngLat([12.554729, 55.70651])
//   .addTo(map);