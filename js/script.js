let longitude = parseFloat(localStorage.getItem("Longitude"));
let latitude = parseFloat(localStorage.getItem("Latitude"));

function initMap(lat=latitude, lon=longitude) {
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: lat, lng: lon}
});

    document.querySelector("button").addEventListener('click', () => {
        let usBounds = {
            north: 49.38,
            south: 24.52,
            west: -124.76,
            east: -66.95
          };
      
          // Generate a random latitude and longitude within the bounds of the US
          let lat = Math.random() * (usBounds.north - usBounds.south) + usBounds.south;
          let lng = Math.random() * (usBounds.east - usBounds.west) + usBounds.west;

          localStorage.setItem("Latitude", lat);
          localStorage.setItem("Longitude", lng);
      

        initMap(lat, lng)
    }, {passive: true})
}