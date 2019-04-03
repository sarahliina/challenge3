// API key Algorithmia: sim5vw5W3nYhD2MTZ8UkIqczTSI1
// API key OnWater: DTNDhFGkoWtVzcgiYWdU
// API key AirVisual: 8w4SQKgbZEmvNcCQW

// Checks if part of time is under 10 & adds a 0 in front
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Checks if day is 1, 2, or 3 and adds prefix, otherwise th
function checkDay(n) {
  switch (n) {
    case 1:
      n = n + "<sup>st</sup>";
      break;
    case 2:
      n = n + "<sup>nd</sup>";
      break;
    case 3:
      n = n + "<sup>rd</sup>";
      break;
    case 21:
      n = n + "<sup>st</sup>";
      break;
    case 22:
      n = n + "<sup>nd</sup>";
      break;
    case 23:
      n = n + "<sup>rd</sup>";
      break;
    case 31:
      n = n + "<sup>st</sup>";
      break;
    default:
      n = n + "<sup>th</sup>";
      break;
  }
  return n;
}

// Function that displays current date
function date() {
  var date = new Date();
  // Gets todays full date
  var day = date.getDate();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var year = date.getFullYear() + 49;
  // Displays date
  document.getElementById("date").innerHTML = checkDay(day) + "\xa0" + months[date.getMonth()] + "<br>" + year;
}

// Run date function
date();

// Function that displays current time and a countdown
function time() {
  var date = new Date();

  // Get todays full time
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  // Checks if value of time is under 10, then possibly adds a "0"
  hour = checkTime(hour);
  minutes = checkTime(minutes);
  seconds = checkTime(seconds);

  // Displays current time
  document.getElementById("hour").innerHTML = hour + ":";
  document.getElementById("minutes").innerHTML = minutes + ":";
  document.getElementById("seconds").innerHTML = seconds;

  // Refreshes time once every second
  setTimeout(time, 1000);

  // Creates new future date
  var countDownDate = new Date("May 5, 2019 15:37:25").getTime();

  // Updates the countdown every 1 second
  var x = setInterval(function() {

    // Get todays date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Checks if value of time is under 10, then possibly adds a "0"
    hours = checkTime(hours);
    minutes = checkTime(minutes);
    seconds = checkTime(seconds);

    // Displays the result
    document.getElementById("counter").innerHTML = days + " Days <br>" + hours + " Hours <br>" +
      minutes + " Minutes <br>" + seconds + " Seconds";

  }, 1000);
}

// Runs time function
time();

// Creates random longitude and latitude coordinates and rounds them to 4 decimal points




// Check location
document.getElementById("getLocation").onclick = function() {
  var lon = Math.random() * (180 - (-180) + 1) + (-180);
  var lat = Math.random() * (90 - (-90) + 1) + (-90);

  // Creates new variable holding a request with API key and created coordinates for weather information
  var requestAir = "https://api.airvisual.com/v2/nearest_city?lat=" + lat + "&lon=" + lon + "&key=8w4SQKgbZEmvNcCQW"
  mode: "no-cors";

  // Fetches the request from the website & connects to a function holding the response
  fetch(requestAir).then(function(responseAir) {
      // Returns the response & json-ifies it
      return responseAir.json();
    })
    // Connects to the fetch and creates a function to do following things with the response
    .then(function(responseAir) {
      if (responseAir.status == "fail") {
        error();
      } else {
        // Displays weather icon
        document.getElementById("weatherIcon").src = "./images/" + responseAir.data.current.weather.ic + ".png";
        // Displays current temperature in degrees Celsius
        document.getElementById("degCelsius").innerHTML = responseAir.data.current.weather.tp + " C";
        // Displays the city and country name
        document.getElementById("city").innerHTML = responseAir.data.city + ", " + responseAir.data.country;
        // Displays current coordinates
        document.getElementById("currentLocation").innerHTML = "Your current coordinates are <br><br> Latitude: " + lat.toFixed(4) + "<br> Longitude: " + lon.toFixed(4);

        water(lat, lon);
        distance(lat, lon);
        map(lat, lon);
        // directions(lat, lon);
      };
    });
}

function error() {
  var currentLocation = document.getElementById("currentLocation");
  document.getElementById("weatherIcon").src = "./images/temperature.png";
  document.getElementById("degCelsius").innerHTML = "";
  document.getElementById("city").innerHTML = "";
  document.getElementById("checkedLocation").innerHTML = "Check your location to see if you will touch down on water or land.";
  document.getElementById("distance").innerHTML = "Distance of your landing spot to the Kennedy Space Centre.";

  currentLocation.classList.add("apply-shake");
  currentLocation.innerHTML = "Your current location could not be found. Please try again.";
  currentLocation.addEventListener("animationend", (e) => {
    currentLocation.classList.remove("apply-shake");
  });
}

function water(lat, lon) {
  // Creates new variable holding a request with API key and coordinates to check for water or land
  var request = "https://api.onwater.io/api/v1/results/" + lat + "," + lon + "?access_token=DTNDhFGkoWtVzcgiYWdU"
  mode: "no-cors";
  // Fetches the request from the website & connects to a function holding the response
  fetch(request).then(function(responseWater) {
      // Returns the response & json-ifies it
      return responseWater.json();
    })
    // Connects to the fetch and creates a function to do following things with the response
    .then(function(responseWater) {
      // Creates an if-statment that says if the response water is true, then display this text
      if (responseWater.water == true) {
        document.getElementById("checkedLocation").innerHTML = "You will touch down on water!";
        // Otherwise display this text
      } else {
        document.getElementById("checkedLocation").innerHTML = "You will touch down on land!";
      }
    });
}

function distance(lat, lon) {
  var request = [lat, lon, 28.5729, 80.6490, "km"];
  Algorithmia.client("sim5vw5W3nYhD2MTZ8UkIqczTSI1")
    .algo("Geo/LatLongDistance/0.1.1?timeout=300") // timeout is optional
    .pipe(request)
    .then(function(response) {
      document.getElementById("distance").innerHTML = response.result.toFixed(2) + " km <br> to the Kennedy Space Centre.";
    });
}

function map(lat, lon) {


  L.mapbox.accessToken = "pk.eyJ1Ijoic2FyYWhsaW5hIiwiYSI6ImNqdHp1a2xsbTBlcmQ0M3QxYmhnNW1ucngifQ.wtVWTOpFLslHYIVSGNQLlg";

  var mapboxTiles = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=" + L.mapbox.accessToken);

  var map = L.map("map")
    .addLayer(mapboxTiles)
    .setView([lat, lon], 10);

  var fixedMarker = L.marker(new L.LatLng(lat, lon), {
    icon: L.mapbox.marker.icon({
      "marker-color": "ff8888"
    })
  }).bindPopup("Mapbox DC").addTo(map);

  var fc = fixedMarker.getLatLng();
  var featureLayer = L.mapbox.featureLayer().addTo(map);
}

// function directions(lat, lon) {
//   mapboxgl.accessToken = "pk.eyJ1Ijoic2FyYWhsaW5hIiwiYSI6ImNqdHp1a2xsbTBlcmQ0M3QxYmhnNW1ucngifQ.wtVWTOpFLslHYIVSGNQLlg";
//   var map = new mapboxgl.Map({
//     container: "map",
//     style: "mapbox://styles/mapbox/streets-v11",
//     center: [lon, lat],
//     zoom: 13
//   });
//
//   map.addControl(new MapboxDirections({
//     accessToken: L.mapbox.accessToken
//   }), "top-left");
//
// }


console.log("Welcome to the console!");