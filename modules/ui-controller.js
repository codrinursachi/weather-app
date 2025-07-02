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
    historySection: document.querySelector("#history-section"),
    historyList: document.querySelector("#history-list"),
    clearHistoryBtn: document.querySelector("#clear-history-btn"),
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
    elements.unit.textContent =
        loadUserPreferences().unit === "metric" ? "°C" : "°F";
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

export const showHistory = () => {
    elements.historySection.classList.remove("hidden");
};

export const hideHistory = () => {
    elements.historySection.classList.add("hidden");
};

export const renderHistory = (historyItems) => {
    // Construiește HTML pentru fiecare item din istoric
    // Fiecare item ar trebui să fie clickabil
    // Afișează orașul, țara și timpul relativ (ex: "2 ore în urmă")
    if (historyItems.length === 0) {
        elements.historyList.innerHTML =
            '<p class="no-history">Nu ai căutări recente</p>';
        return;
    }

    const historyHTML = historyItems
        .map((item) => {
            const timeAgo = getTimeAgo(item.timestamp);
            return `
      <div class="history-item" data-city="${item.city}" data-lat="${item.coordinates.lat}" data-lon="${item.coordinates.lon}">
        <div class="history-location">
          <span class="city">${item.city}</span>
          <span class="country">${item.country}</span>
        </div>
        <div class="history-time">${timeAgo}</div>
      </div>
    `;
        })
        .join("");

    elements.historyList.innerHTML = historyHTML;
};

// Helper function pentru timpul relativ
const getTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minute în urmă`;
    if (hours < 24) return `${hours} ore în urmă`;
    return `${days} zile în urmă`;
};

export const addHistoryEventListeners = (onHistoryClick, onClearHistory) => {
    // Event listener pentru click pe istoric
    // Event listener pentru ștergerea istoricului
    elements.historyList.addEventListener("click", onHistoryClick);
    elements.clearHistoryBtn.addEventListener("click", onClearHistory);
};
