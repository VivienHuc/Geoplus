var blueIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function not_seen_display() {
  if (map.hasLayer(not_seen))
  map.removeLayer(not_seen)
  else
  map.addLayer(not_seen);
}

function accepted_display() {
  if (map.hasLayer(accepted))
  map.removeLayer(accepted)
  else
  map.addLayer(accepted);
}

function declined_display() {
  if (map.hasLayer(declined))
  map.removeLayer(declined)
  else
  map.addLayer(declined);
}

function createHabitant(habitant) {
  var habitant = new Habitant(habitant.id, habitant.name, habitant.address, habitant.position, habitant.given);
  habitants.push(habitant);
}

function createMarker(habitant) {
  if (habitant.given == 0) {
    var marker = new L.marker([habitant.position[0], habitant.position[1]], {icon: blueIcon});
    not_seen.addLayer(marker);
  } else if (habitant.given > 0) {
    var marker = new L.marker([habitant.position[0], habitant.position[1]], {icon: greenIcon});
    accepted.addLayer(marker);
  } else if (habitant.given == -1) {
    var marker = new L.marker([habitant.position[0], habitant.position[1]], {icon: redIcon});
    declined.addLayer(marker);
  }
  marker.on("click", function(){
    var popup = L.popup()
    .setLatLng([habitant.position[0], habitant.position[1]])
    .setContent("<form action='/map' method='post'>" +
    "<input type='string' name='i' id='i' style='display: none' value=" + habitant._id + ">" +
    "<p>" + habitant.name + "</p>" +
    "<p>" + habitant.address + "</p>" +
    "<input type='submit' value='A donné'>" +
    "<input type='number' name='given' value=''>€" +
    "</form>")
    .openOn(map);
  })
}

var habitants = [];

class Habitant {
  constructor(name, address, position, given) {
    this.name = name;
    this.address = address;
    this.position = position;
    this.given = given;
  }
}

var map = L.map('map').setView([44.28, 0.76], 14);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYnVsbHk0MiIsImEiOiJjanJycDZwenIxd29rM3ludHJvNXhiem1kIn0.udyct1AnSScGg3eIa3VQDw', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiYnVsbHk0MiIsImEiOiJjanJycDZwenIxd29rM3ludHJvNXhiem1kIn0.udyct1AnSScGg3eIa3VQDw'
}).addTo(map);

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var data = JSON.parse(this.responseText);
    data.forEach(function (habitant) {
      createHabitant(habitant);
      createMarker(habitant);
    });
  }
};
xmlhttp.open("GET", "js/habitants.json", true);
xmlhttp.send();

var not_seen = new L.layerGroup();
var accepted = new L.layerGroup();
var declined = new L.layerGroup();

map.addLayer(not_seen);
map.addLayer(accepted);
map.addLayer(declined);
