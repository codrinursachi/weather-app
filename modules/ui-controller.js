import { CONFIG } from "./config.js";

export const elements = {
    weatherDisplay: document.querySelector("#weather-display"),
    cityInput: document.querySelector("#city-input"),
    cityName: document.querySelector("#city-name"),
    temp: document.querySelector("#temp-value"),
    unit: document.querySelector("#unit"),
    humidity: document.querySelector("#humidity"),
    description: document.querySelector("#description"),
    windSpeed: document.querySelector("#wind-speed"),
    loading: document.querySelector("#loading"),
    error: document.querySelector("#error"),
    icon: document.querySelector("#icon"),
    pressure: document.querySelector("#pressure"),
    visibility: document.querySelector("#visibility"),
    sunrise: document.querySelector("#sunrise"),
    sunset: document.querySelector("#sunset"),
    unitSelect: document.querySelector("#unit-select"),
    langSelect: document.querySelector("#lang-select"),
};

export const showLoading = () => {
    elements.loading.classList.remove("hidden");
    elements.weatherDisplay.classList.add("hidden");
};
export const hideLoading = () => {
    elements.loading.classList.add("hidden");
    elements.weatherDisplay.classList.remove("hidden");
};

export const showError = (message) => {
    elements.error.classList.remove("hidden");
    elements.error.textContent = message;
};

export const displayWeather = (data) => {
    elements.cityName.textContent = data.name;
    elements.icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    elements.temp.textContent = `${data.main.temp}`;
    elements.unit.textContent = loadUserPreferences().unit === "metric" ? "°C" : "°F";
    elements.description.textContent = data.weather[0].description;
    elements.humidity.textContent = `Humidity: ${data.main.humidity}%`;
    elements.pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
    elements.windSpeed.textContent = `Wind speed ${data.wind.speed * 3.6} km/h`;
    elements.visibility.textContent = `Visibility: ${
        data.visibility / 1000
    } km`;
    elements.sunrise.textContent =
        "Sunrise " + new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    elements.sunset.textContent =
        "Sunset " + new Date(data.sys.sunset * 1000).toLocaleTimeString();

    elements.error.classList.add("hidden");
};

export const getCityInput = () => {
    return elements.cityInput.value.trim();
};

export const clearCityInput = () => {
    elements.cityInput.value = "";
};

// Funcție pentru salvarea preferințelor
export const saveUserPreferences = (unit, lang) => {
    // Cum folosești localStorage?
    // Ce chei folosești pentru stocare?
    window.localStorage.setItem("unit", unit);
    window.localStorage.setItem("lang", lang);
};

// Funcție pentru încărcarea preferințelor
export const loadUserPreferences = () => {
    // Cum citești din localStorage?
    // Ce valori default folosești dacă nu există preferințe?
    return {
        unit:
            window.localStorage.getItem("unit") ||
            CONFIG.DEFAULT_UNITS /* ce default? */,
        lang:
            window.localStorage.getItem("lang") ||
            CONFIG.DEFAULT_LANG /* ce default? */,
    };
};