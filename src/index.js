function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

// get the class of the weather icon, needed for dark mode
function getWeatherIconClass(code) {
  if (!(code in customWeatherData)) {
    code = "default";
  }
}
function updatePlayer(code) {
  let musicPlayerElement = document.querySelector("#music-player");
  let textPlayerElement = document.querySelector("#text-player");
  let bgImage = document.querySelector(".transparent-box");
  if (!(code in customWeatherData)) {
    code = "default";
  }
  musicPlayerElement.setAttribute(
    "src",
    `https://open.spotify.com/embed/track/${customWeatherData[code].spotifyId}`
  );
  textPlayerElement.innerHTML = customWeatherData[code].trackDescription;

  bgImage.style.backgroundImage = `${customWeatherData[code].backgroundImage}`;
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row daily-wrap">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` <div class="col-2">
              <div class="forecast-date">${formatDay(forecastDay.dt)}
              </div>
              <img
                src="icons/${forecastDay.weather[0].icon}.svg"
                alt="" width="70" class="daily-icons"
                />
              <div class="forecast-temperature">
                <span class="forecast-maximum"> ${Math.round(
                  forecastDay.temp.max
                )}° </span>
                <span class="forecast-minimum"> ${Math.round(
                  forecastDay.temp.min
                )}° </span>
              </div>
            </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;

  let currentTempIconElement = document.querySelector("#current-temp-icon");
  let iconClass = getWeatherIconClass(response.data.current.weather[0].icon);
  currentTempIconElement.setAttribute("class", `fas ${iconClass}`);
  updatePlayer(response.data.current.weather[0].icon);
}

function getForecast(coordinates) {
  let apiKey = "743bee57fddbfaf52447193a87d5dd25";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);

  currentTempIconElement.setAttribute(
    "alt",
    response.data.current.weather[0].description
  );

  return response;
}

function displayWeatherCondition(response) {
  console.log(response);
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#country").innerHTML = response.data.sys.country;
  temperatureElement = document.querySelector("#current-temperature");
  console.log(response);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#feelsLike").innerHTML = Math.round(
    response.data.main.feels_like
  );
  icon = document.querySelector("#current-condition").innerHTML =
    response.data.weather[0].main;

  document.querySelector("#high-temp").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#low-temp").innerHTML = Math.round(
    response.data.main.temp_min
  );

  celsiusTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let iconElement = document.querySelector("#icon");

  iconElement.setAttribute("src", `icons/${response.data.weather[0].icon}.svg`);
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);

  //let backgroundElement = document.querySelector(".transparent-box");
  // backgroundElement.style.backgroundImage = url(src/img-background/${response.data.weather[0].icon}.jpg)`;
}

function searchCity(city) {
  let apiKey = "743bee57fddbfaf52447193a87d5dd25";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(getLocationInfo).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
  city = city.trim();
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "743bee57fddbfaf52447193a87d5dd25";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);
}
function getLocationInfo(response) {
  latitude = response.data.coord.lat;
  longitude = response.data.coord.lon;
  return response;
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let dateElement = document.querySelector("#date");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

  return days[day];
}

let customWeatherData = {
  "01d": {
    // clear sky, day
    iconClass: "fa-sun",
    spotifyId: "5YMXGBD6vcYP7IolemyLtK?utm_source=generator",
    trackDescription:
      "What a beautiful sunny day! Get inspired by this soundtrack for today’s wild adventures:",
    backgroundImage: "url(src/img-background/01d.jpg)",
  },

  "01n": {
    // clear sky, night
    iconClass: "fa-moon",
    spotifyId: "0o9zmvc5f3EFApU52PPIyW?utm_source=generator",
    trackDescription:
      "What a crystal-clear, cloudless sky! Here's the perfect soundtrack for looking at the stars:",
    backgroundImage: "url(src/img-background/01n.jpg)",
  },
  "02d": {
    // few clouds, day
    iconClass: "fa-cloud-sun",
    spotifyId: "0T5iIrXA4p5GsubkhuBIKV?utm_source=generator",
    trackDescription:
      "Yeehaw, there’re only a few clouds in the sky! Listen to the perfect soundtrack for this wonderful day:",
    backgroundImage: "url(src/img-background/02d.jpg)",
  },
  "02n": {
    // few clouds, night
    iconClass: "fa-cloud-moon",
    spotifyId: "7zFXmv6vqI4qOt4yGf3jYZ?utm_source=generator",
    trackDescription:
      "Turn up the music and forget about the clouds hiding the stars! Here's the perfect track for gloomy nights:",
    backgroundImage: "url(src/img-background/02n.jpg)",
  },
  "03d": {
    // scattered clouds, day
    iconClass: "fa-cloud",
    spotifyId: "3bjg5cbmuwDoS7e2dAWyRG?utm_source=generator",
    trackDescription:
      "Turn up the music and forget about the grey sky! Here's the perfect soundtrack for cloudy days:",
    backgroundImage: "url(src/img-background/03d.jpg)",
  },
  "03n": {
    // scattered clouds, night
    iconClass: "fa-cloud",
    spotifyId: "3xKsf9qdS1CyvXSMEid6g8?utm_source=generator",
    trackDescription:
      "Turn up the music and forget about the clouds! Here's the perfect soundtrack for starless nights:",
    backgroundImage: "url(src/img-background/03n.jpg)",
  },
  "04d": {
    // broken clouds, day
    iconClass: "fa-cloud",
    spotifyId: "5HsSsEeP3hU9QSfHZrzbtA?utm_source=generator",
    trackDescription:
      "Turn up the music and forget about the grey sky! Here's the perfect soundtrack for cloudy days:",
    backgroundImage: "url(src/img-background/04d.jpg)",
  },
  "04n": {
    // broken clouds, night
    iconClass: "fa-cloud",
    spotifyId: "5CM4UuQ9Gnd6K2YyKGPMoK?utm_source=generator",
    trackDescription:
      "Turn up the music and forget about the clouds! Here's the perfect soundtrack for starless nights:",
    backgroundImage: "url(src/img-background/04n.jpg)",
  },
  "09d": {
    // shower rain, day
    iconClass: "fa-cloud-showers-heavy",
    spotifyId: "5v2xgL8y4XI0hi50cU574j?utm_source=generator",
    trackDescription:
      "Turn up the music and forget about the rain! Here's the perfect soundtrack for grey days:",
    backgroundImage: "url(src/img-background/09d.jpg)",
  },
  "09n": {
    // shower rain, night
    iconClass: "fa-cloud-showers-heavy",
    spotifyId: "08MFgEQeVLF37EyZ7jcwLc?utm_source=generator",
    trackDescription:
      "Turn up the music and forget about the rain! Here's the perfect soundtrack for starless nights:",
    backgroundImage: "url(src/img-background/09n.jpg)",
  },
  "10d": {
    // rain, day
    iconClass: "fa-cloud-sun-rain",
    spotifyId: "2E25yFTkFXLwtWPMqftlbZ?utm_source=generator",
    trackDescription:
      "It's raining cats and dogs! Here's the perfect soundtrack for singing in the rain and forgetting about the grey:",
    backgroundImage: "url(src/img-background/10d.jpg)",
  },
  "10n": {
    // rain, night
    iconClass: "fa-cloud-moon-rain",
    spotifyId: "1DNA2z7Txysjk3cNz2nDLm?utm_source=generator",
    trackDescription:
      "Turn up the music and forget about the rain! Here's the perfect soundtrack for starless nights:",
    backgroundImage: "url(src/img-background/10n.jpg)",
  },
  "11d": {
    // thunderstorm, day
    iconClass: "fa-bolt",
    spotifyId: "4lAE47gj539h8R1yxPhhGG?utm_source=generator",
    trackDescription:
      "Turn up the music and drown out the thunder! Here's the perfect soundtrack for stormy days:",
    backgroundImage: "url(src/img-background/11d.jpg)",
  },
  "11n": {
    // thunderstorm, night
    iconClass: "fa-bolt",
    spotifyId: "54X78diSLoUDI3joC2bjMz?utm_source=generator",
    trackDescription:
      "Turn up the music and drown out the thunder! Here's the perfect soundtrack for scary nights:",
    backgroundImage: "url(src/img-background/11n.jpg)",
  },
  "13d": {
    // snow, day
    iconClass: "fa-snowflake",
    spotifyId: "4LRPiXqCikLlN15c3yImP7?utm_source=generator",
    trackDescription:
      "Turn up the music and forget about the cold! Here's a heartwarming track for snowy days:",
    backgroundImage: "url(src/img-background/13d.jpg)",
  },
  "13n": {
    // snow, night
    iconClass: "fa-snowflake",
    spotifyId: "2wSTnntOPRi7aQneobFtU4?utm_source=generator",
    trackDescription:
      "Turn up the music and forget about the cold! Here's a heartwarming track for snowy nights:",
    backgroundImage: "url(src/img-background/13n.jpg)",
  },
  "50d": {
    // mist, day
    iconClass: "fa-smog",
    spotifyId: "1boXOL0ua7N2iCOUVI1p9F?utm_source=generator",
    trackDescription:
      "Turn up the music and forget about the mist! Here's the perfect soundtrack for gloomy days:",
    backgroundImage: "url(src/img-background/50d.jpg)",
  },
  "50n": {
    // mist, night
    iconClass: "fa-smog",
    spotifyId: "3azJifCSqg9fRij2yKIbWz?utm_source=generator&theme=0",
    trackDescription:
      "Turn up the music and forget about the mist! Here's the perfect soundtrack for starless nights:",
    backgroundImage: "url(src/img-background/50n.jpg)",
  },
  default: {
    // if we get an unusual code
    iconClass: "fa-question",
    spotifyId: "5YMXGBD6vcYP7IolemyLtK?utm_source=generator",
    trackDescription:
      "You seem to have weird weather! Get weirded out some more with this track:",
    backgroundImage: "url(src/img-background/01d.jpg)",
  },
};
let units = "metric";
searchCity("London");
displayForecast();
