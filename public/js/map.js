if (coordinates.length == 0) {
  //if the coordinates is undefined = Default value(New Delhi)
  coordinates = [77.1025, 28.7041];
}
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

console.log(coordinate);

const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.name}</h4>
      <p>Exact Location will be provided after booking</p>`
    )
  )
  .addTo(map);
  

// .addTo(map);