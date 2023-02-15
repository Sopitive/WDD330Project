let longitude = parseFloat(localStorage.getItem("Longitude"));
let latitude = parseFloat(localStorage.getItem("Latitude"));
let requestID;

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
      
          let lat = Math.random() * (usBounds.north - usBounds.south) + usBounds.south;
          let lng = Math.random() * (usBounds.east - usBounds.west) + usBounds.west;

          localStorage.setItem("Latitude", lat);
          localStorage.setItem("Longitude", lng);
      

          map.setCenter({lat: lat, lng: lng});

        getAddress(lat, lng);

        let key = "c214e3f900b57a2339e013f6fe75b871"

        fetch(`https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${lat}&lon=${lng}&appid=${key}`).then(response=>response.json())
            .then(data=> {
                console.log(data);
                localStorage.setItem("PrevWeather", JSON.stringify(data));
                setWeather()
            })

        
    }, {passive: true})
}

function getAddress(lat, lng) {
    var geocoder = new google.maps.Geocoder();

var latLng = new google.maps.LatLng(lat, lng);

geocoder.geocode({'latLng': latLng}, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
    if (results[0]) {
      var address = results[0].formatted_address;
      console.log(address);
    }
  }
});
}


function setWeather() {
    let weatherData = localStorage.getItem("PrevWeather");
    weatherData = JSON.parse(weatherData);

    let city = weatherData.name;
    let temp = parseInt(weatherData.main.temp);
    let humidity = weatherData.main.humidity;
    let weatherState = weatherData.weather[0].main;
    
    const root = document.querySelector(":root");
    if (requestID) {
        window.cancelAnimationFrame(requestID);
    }
    let canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (weatherState == "Snow") {
        drawSnow(canvas);
    } else if (weatherState == "Rain") {
        drawRain(canvas);
    }
    

    document.querySelector("#temp").innerHTML = `Temperature: ${temp}F`;
    document.querySelector("#city").innerHTML = `City: ${city}`;
    document.querySelector("#humidity").innerHTML = `Humidity: ${humidity}%`;
    document.querySelector("#weather-state").innerHTML = `Conditions: ${weatherState}`

}

window.onload = function () {
    setWeather();
}


function drawSnow(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const flakes = [];

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    class Snowflake {
      constructor() {
        this.x = random(0, width);
        this.y = random(-height, 0);
        this.size = random(1, 3);
        this.speed = random(1, 2);
      }
      fall() {
        this.y += this.speed;
        if (this.y > height) {
          this.y = random(-height, 0);
          this.x = random(0, width);
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
    }
  
    function update() {
      ctx.clearRect(0, 0, width, height);
  
      while (flakes.length < 100) {
        flakes.push(new Snowflake());
      }
  
      flakes.forEach((flake) => {
        flake.fall();
        flake.draw();
      });
      requestID = window.requestAnimationFrame(update);
    }
    update();
  }
  

  function drawRain() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const numDrops = 200;
    const maxSpeed = 5;
    const maxRadius = 2;
    
    const drops = [];
    for (let i = 0; i < numDrops; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * maxRadius,
        speed: Math.random() * maxSpeed,
      });
    }
    
    function drawDrop(drop) {
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, drop.radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#6495ED';
      ctx.fill();
    }
    
    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drops.forEach(drop => {
        drop.y += drop.speed;
    
        if (drop.y > canvas.height) {
          drop.x = Math.random() * canvas.width;
          drop.y = 0;
        }
      });
    
      drops.forEach(drawDrop);
    
      requestID = window.requestAnimationFrame(update);
    }
    
    update();
  }
  