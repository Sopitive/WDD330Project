let longitude = parseFloat(localStorage.getItem("Longitude"));
let latitude = parseFloat(localStorage.getItem("Latitude"));
let requestID;
let gameID;
let gameID2;
let dx;

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
    let geocoder = new google.maps.Geocoder();

let latLng = new google.maps.LatLng(lat, lng);

geocoder.geocode({'latLng': latLng}, function(results, status) {
if (status == google.maps.GeocoderStatus.OK) {
    if (results[0]) {
    let address = results[0].formatted_address;
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
    window.cancelAnimationFrame(gameID);
    window.cancelAnimationFrame(gameID2);
    document.querySelector("#game").style.display = "none";
    if (weatherState == "Snow") {
        startGame();
        canvas.scrollIntoView();
        drawSnow(canvas);
        document.querySelector("#game").style.display = "block";
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


function startGame() {
        let canvas = document.getElementById('game');
        let ctx = canvas.getContext('2d');

        let snowball = {
            x: canvas.width/2,
            y: canvas.height-20,
            radius: 8,
            color: '#fff'
        };

        let snowman = {
            x: canvas.width/2,
            y: 50,
            radius: 15,
            color: '#eee'
        };

        let score = 0;
let updateInterval;
let mouseX;
let mouseY;

canvas.addEventListener("click", (event) =>{
    if (updateInterval) {
        clearInterval(updateInterval);
    }

    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.width;
    mouseY = (event.clientY - rect.height);

    const dx = mouseX + snowball.x + 400;
    const dy = (mouseY - snowball.y);
    console.log(dx);
    let angle = Math.atan2(dy, dx);

    let distance;

    const speed = 10;
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;

    updateInterval = setInterval(function() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snowball.x += velocityX;
    snowball.y += velocityY;

    ctx.beginPath();
    ctx.arc(snowball.x, snowball.y, snowball.radius, 0, 2*Math.PI);
    ctx.fillStyle = snowball.color;
    ctx.fill();
    distance = Math.sqrt(Math.pow(snowball.x - snowman.x, 2) + Math.pow(snowball.y - snowman.y, 2));
        if (distance < snowball.radius + snowman.radius) {
            score++;
            snowball.x = canvas.width/2;
            snowball.y = canvas.height-20;
            clearInterval(updateInterval);
            snowball.x = canvas.width/2;
            snowball.y = canvas.height-20;
        }

    if (snowball.x < 0 || snowball.x > canvas.width || snowball.y < 0 || snowball.y > canvas.height) {
        clearInterval(updateInterval);
        snowball.x = canvas.width/2;
        snowball.y = canvas.height-20;
    }
    }, 50);
});
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.arc(snowball.x, snowball.y, snowball.radius, 0, Math.PI*2);
            ctx.fillStyle = snowball.color;
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(snowman.x, snowman.y, snowman.radius, 0, Math.PI*2);
            ctx.fillStyle = snowman.color;
            ctx.fill();
            ctx.closePath();

            
            ctx.fillStyle = '#000';
            ctx.font = 'bold 20px Arial';
            ctx.fillText('Score: ' + score, 10, 30);

            
            if (!dx) {
                dx = -1
            }
            if (snowman.x > canvas.width) {
                dx = -1;
            }
            if (snowman.x < 0) {
                dx = 1;
            }
            snowman.x += dx;

            gameID2 = requestAnimationFrame(draw);
        }
        gameID = requestAnimationFrame(draw);
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
