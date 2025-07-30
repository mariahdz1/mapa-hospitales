let map;
let directionsService;
let directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 4.65, lng: -74.1 },
    zoom: 11,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((hospital) => {
        const color =
          hospital.congestion === "alta"
            ? "red"
            : hospital.congestion === "media"
            ? "orange"
            : "green";

        const marker = new google.maps.Marker({
          position: { lat: hospital.lat, lng: hospital.lng },
          map,
          title: hospital.nombre,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: "#000",
            strokeWeight: 1,
          },
        });

        const info = new google.maps.InfoWindow({
          content: `<strong>${hospital.nombre}</strong><br>Ocupación: ${hospital.ocupacion}<br>Congestión: ${hospital.congestion}`,
        });

        marker.addListener("click", () => {
          info.open(map, marker);

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const origen = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                const destino = { lat: hospital.lat, lng: hospital.lng };

                directionsService.route(
                  {
                    origin: origen,
                    destination: destino,
                    travelMode: google.maps.TravelMode.DRIVING,
                  },
                  (result, status) => {
                    if (status === "OK") {
                      directionsRenderer.setDirections(result);
                    } else {
                      alert("No se pudo calcular la ruta: " + status);
                    }
                  }
                );
              },
              () => {
                alert("No se pudo obtener tu ubicación.");
              }
            );
          } else {
            alert("Tu navegador no soporta geolocalización.");
          }
        });
      });
    });
}
