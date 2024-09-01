/**
 * Geo Location API
 */
/*
// navigator.geolocation object will provide the user location
if (navigator.geolocation) {
  console.log("Your browser supports the Geolocation API!");

  navigator.geolocation.getCurrentPosition(success, error, {
    // enableHighAccuracy: true,
    // timeout: 0,
    maximumAge: 10 * 60 * 1000, // 0 means it will get the latest position
  });

  // // geolocation.watchPosition method
  // const watcher = navigator.geolocation.watchPosition(success, error);

  // // clear watcher
  // setTimeout(function () {
  //   navigator.geolocation.clearWatch(watcher);
  // }, 15000);
} else {
  console.log("Your browser does not support the Geolocation API!");
}

function success(position) {
  // console.log(position);
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // map options
  const mapOptions = {
    center: [lat, lon],
    zoom: 15,
  };

  // create a map
  const map = L.map("map", mapOptions);

  // create a tile layer
  const layer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );

  // add the tile layer to the map
  map.addLayer(layer);

  // create a custom icon
  const customIcon = L.icon({
    iconUrl: "./marker.png",
    iconSize: [50, 50],
  });

  // marker options
  const markerOptions = {
    title: "My Location",
    clickable: true,
    draggable: true,
    icon: customIcon,
  };

  // create the marker
  const marker = L.marker([lat, lon], markerOptions);

  // add the marker to the map
  map.addLayer(marker);

  // bind popup
  marker.bindPopup("Your current location");
} */

/**
 * Error code
 * (I). Code: 1 -> Permission denied
 * (II). Code: 2 -> Position unavailable
 * (III). Code: 3 -> Time out
 */
function error(error) {
  switch (error.code) {
    case 1:
      console.log("User denied the request for Geolocation.");
      break;
    case 2:
      console.log("Location service is unavailable.");
      break;
    case 3:
      console.log("The request to get user location timed out.");
      break;
    default:
      console.log("We couldn't retrieve your current location");
      break;
  }
}

/**
 * GeoJSON and leaflet
 */
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
}

let map;

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const mapOptions = {
    center: [lat, lon],
    zoom: 1,
  };

  map = L.map("map", mapOptions);

  const layer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );

  map.addLayer(layer);

  const iconOptions = {
    iconUrl: "./marker.png",
    iconSize: [50, 50],
  };

  const customIcon = L.icon(iconOptions);

  function runForEachFeature(feature, layer) {
    // implementation
    layer.bindPopup(customPopup(feature));
  }

  // store layer
  const storeLayer = L.geoJSON(storeList, {
    onEachFeature: runForEachFeature,
    pointToLayer: function (feature, lat_lon) {
      return L.marker(lat_lon, {
        icon: customIcon,
      });
    },
  });

  console.log(storeLayer);

  map.addLayer(storeLayer);
}

// create a custom popup
function customPopup(store) {
  return `<div class="pb-4">
    <h4 class="bg-green-600 p-4 text-white text-xl font-semibold rounded-t-xl">${store.properties.name}</h4>
    <p class="text-gray-800 text-sm px-4">${store.properties.address}</p>
    <a class="text-sm px-4" href='tel:${store.properties.phone}' >${store.properties.phone}</a>
  </div>`;
}

function generateStoreList() {
  const ul = document.getElementById("store-ul-list");

  storeList.forEach((store) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const a = document.createElement("a");
    const p = document.createElement("p");

    // li.classList.add("border-b","border-gray-200", "last:border-b-0");
    div.classList.add("mt-3");
    a.classList.add("text-green-500", "text-2xl", "font-semibold");
    p.classList.add("text-gray-200", "text-base");

    a.href = "#";
    a.addEventListener("click", () => {
      flyToStore(store);
    });
    a.innerText = store.properties.name;
    p.innerText = store.properties.address;

    div.appendChild(a);
    div.appendChild(p);
    li.appendChild(div);
    ul.appendChild(li);
  });
}

generateStoreList();

function flyToStore(store) {
  console.log(store);
  const lat = store.geometry.coordinates[0];
  const lon = store.geometry.coordinates[1];
  map.flyTo([lon, lat], 14, {
    // animate: false,
    duration: 2,
  });
}
