//////////////////////////////////////
/////////// INITIALIZE MAP ///////////
//////////////////////////////////////

// array to hold markers
let markerLayer = [];

// INITIALIZE MAP
var map = L.map("map", {
  center: [0, 0],
  zoom: 2,
});

// url for tileset
let tiles =
  "https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";
// tiles = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"

// add tile layer
L.tileLayer(tiles, {
  maxZoom: 13,
  minZoom: 2,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

/**
 *  Called (by main.js) on load and after form submission
 */
function updateMap(data) {
  
  // 👉 add code inside this function (from Chapter 10) ...
  
  // remove all the markers
  removeMarkers();

  // loop through JSON
  for (let i = 0; i < data.length; i++) {
    console.log(data[i]);
    
    // create marker and add to array
    markerLayer[i] = createMarker(data[i]);
  }
  
  // 👈
}

/**
 *  Create and add marker to map
 */
function createMarker(row) {
  let popupContent = `${row.feeling} (${row.id})`;
  let marker = L.circleMarker([row.lat, row.lng], {
    radius: 50,
    stroke: false,
    color: row.color,
    fillOpacity: getFillOpacity(),
    className: "blur",
  });
  marker.addTo(map).bindPopup(popupContent);
  return marker;
}


//////////////////////////////////////
/////////////// EVENTS ///////////////
//////////////////////////////////////

let inputMarker;
let popup = L.popup();

map.on("click", (e) => {
  // wrap latlng (reset coordinates on dateline -180 and +180 degrees)
  let latlng = L.latLng([e.latlng.lat, e.latlng.lng]).wrap();
  // prevent specific locations
  latlng.lat = Number(latlng.lat.toPrecision(4));
  latlng.lng = Number(latlng.lng.toPrecision(5));

  if (!inputMarker) {
    // add marker if it doesn't yet exist
    inputMarker = L.marker(latlng).addTo(map);
  } else {
    // thereafter, update its position
    inputMarker.setLatLng(latlng).update();
  }

  let location = document.querySelector("#location");
  location.value = `${latlng.lat},${latlng.lng}`;

  console.log(latlng);
  // popup.setLatLng(latlng).setContent(latlng.toString()).openOn(map);
});

// close popups on zoom
map.on("zoomstart", (e) => {
  map.closePopup();
});

// update marker opacity
map.on("zoomend", (e) => {
  markerLayer.forEach(function (marker, i) {
    marker.setStyle({ fillOpacity: getFillOpacity() });
  });
});

// constrain viewport to map tiles (SW, NE) on drag
let bounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));
map.setMaxBounds(bounds);
map.on("drag", function () {
  map.panInsideBounds(bounds, { animate: false });
});

//////////////////////////////////////
////////////// FUNCTIONS /////////////
//////////////////////////////////////

// removes all markers from the map
function removeMarkers() {
  // remove visible marker
  for (let i = 0; i < markerLayer.length; i++) {
    map.removeLayer(markerLayer[i]);
  }  
  // empty the array
  markerLayer = [];
}

function getFillOpacity() {
  return map.getZoom() / 25;
}

// removes warnings (L already defined in HTML file)
var L = window.L;
