let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 4.65, lng: -74.1 }, // Bogotá
    zoom: 11
  });

  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      data.forEach(hospital => {
        const color = hospital.congestion === "alta" ? "red" :
                      hospital.congestion === "media" ? "orange" : "green";

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
            strokeWeight: 1
          }
        });

        const info = new google.maps.InfoWindow({
          content: `<strong>${hospital.nombre}</strong><br>Ocupación: ${hospital.ocupacion}<br>Congestión: ${hospital.congestion}`
        });

        marker.addListener("click", () => {
          info.open(map, marker);
        });
      });
    });
}
