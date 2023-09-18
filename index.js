const landpage = document.getElementById("landpage");
const privacyLink = document.getElementById("privacyPreferences");
const sideMenuSwitch = document.getElementById("sideMenuListener");
const sideMenu = document.getElementById("sideMenu");
const sideMenuCloser = document.getElementById("closeMenuBtn");
const body = document.querySelector("body");
const cardsContainer = document.getElementById("cardsContainer");
const mapListener = document.getElementById("mapListener");
const mapContainer = document.getElementById("mapContainer");
const consultButton = document.getElementById("consultButton");
const cityStatus = document.getElementById("cityStatus");
const cityInput = document.getElementById("cityInput");

var articles = [];
let map, infoWindow;

function showPrivacyPreferences() {
  Swal.fire({
    background: "#000",
    html:
      '<div class="modal-content"><div class="modal-body">' +
      '<p class="logo-modal">STARLINK</p>' +
      "<h4>Centro de preferencia de la privacidad</h4>" +
      "<p>Cuando visita cualquier sitio web, el mismo podría obtener o guardar información en su navegador, generalmente mediante el uso de cookies. Esta información puede ser acerca de usted, sus preferencias o su dispositivo, y se usa principalmente para que el sitio funcione según lo esperado. Por lo general, la información no lo identifica directamente, pero puede proporcionarle una experiencia web más personalizada. Ya que respetamos su derecho a la privacidad, usted puede escoger no permitirnos usar ciertas cookies. Haga clic en los encabezados de cada categoría para saber más y cambiar nuestras configuraciones predeterminadas. Sin embargo, el bloqueo de algunos tipos de cookies puede afectar su experiencia en el sitio y los servicios que podemos ofrecer.</p>" +
      "</div>" +
      "</div>",
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    cancelButtonText: "Rechazarlas todas",
    cancelButtonColor: "#262626",
    confirmButtonColor: "#262626",
    confirmButtonText: "Confirmar mis preferencias",
    buttonsStyling: true,
  });
}

function showSideMenu() {
  sideMenu.style.visibility = "visible";
}

function hideSideMenu() {
  sideMenu.style.visibility = "collapse";
}

function loadArticles() {
  fetch("https://fakestoreapi.com/products?limit=4")
    .then((res) => res.json())
    .then((json) => {
      articles = json;
      articles.forEach((article) => {
        const storeCard = document.createElement("div");
        storeCard.classList.add("store-card");

        storeCard.innerHTML = `
          <img src="${article.image}" alt="" />
          <h3>${article.title}</h3>

          <p class="price">$${article.price}</p>
        `;

        cardsContainer.appendChild(storeCard);
      });
    })
    .catch((error) => {
      console.error("Error al cargar los artículos:", error);
    });
}

// async function initMap() {
//   const { Map } = await google.maps.importLibrary("maps");

//   map = new Map(document.getElementById("map"), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 8,
//   });
// }


async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 33.9207, lng: -118.3278 },
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.HYBRID
    // mapTypeId: 'satellite',
  });
  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  locationButton.textContent = "IR A MI UBICACIÓN";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Ubicación encontrada");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

window.initMap = initMap;


function showMap(){
  mapContainer.style.height = "70vh";
  mapContainer.style.visibility = "visible";
  initMap();
}

body.onload = loadArticles;
sideMenuSwitch.addEventListener("click", showSideMenu, false);
privacyLink.addEventListener("click", showPrivacyPreferences, false);
sideMenuCloser.addEventListener("click", hideSideMenu, false);
mapListener.addEventListener("click", showMap, false);

function startLoadingAnimation() {
  consultButton.innerHTML = '<img src="assets/loading.png" class="button-spinner"/>';
  consultButton.style.background = "#bbbbbb"
  consultButton.disabled = true;
}

function stopLoadingAnimation() {
  let city = cityInput.value;
  consultButton.innerHTML = 'CONSULTAR DISPONIBILIDAD';
  consultButton.style.background = "white";
  consultButton.disabled = false;
  if(city === ""){
    cityStatus.innerHTML = `INCLUYA UNA DIRECCIÓN O UN CÓDIGO PLUS`;
    cityStatus.style.color = "red";
    cityStatus.style.visibility = "visible";
  } else {
    cityStatus.innerHTML = `LA CIUDAD DE ${city.toUpperCase()} ESTÁ DISPONIBLE`;
    cityStatus.style.color = "#01cd18";
    cityStatus.style.visibility = "visible";
  }
}

consultButton.addEventListener("click", function () {
  startLoadingAnimation();
  setTimeout(function () {
    stopLoadingAnimation();
  }, 2100);
});
