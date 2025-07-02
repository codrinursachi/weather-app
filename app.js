// Ce module noi trebuie importate?
import { getCoords } from "./modules/location-service.js";
import {
    getCurrentWeather,
    getWeatherByCoords,
} from "./modules/weather-service.js";
import {
    saveUserPreferences,
    loadUserPreferences,
    addHistoryEventListeners,
    renderHistory,
    showHistory,
} from "./modules/ui-controller.js";
import {
    showLoading,
    showError,
    displayWeather,
    elements,
    hideLoading,
    getCityInput,
} from "./modules/ui-controller.js";
import { logger } from "./modules/logger.js";
import { historyService } from "./modules/history-service.js";

const setupEventListeners = () => {
    // Submit în form (enter din search field sau click pe buton)
    const form = document.querySelector("#city-search-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Previne reload-ul paginii
        handleSearch();
    });

    // Cum gestionezi schimbările de preferințe?
    elements.unitSelect.addEventListener("change", async (e) => {
        const newUnit = e.target.value;

        // Salvează preferința
        const currentPrefs = loadUserPreferences();
        saveUserPreferences(newUnit, currentPrefs.lang);

        // Reîncarcă datele dacă există vreme afișată
        if (
            !elements.weatherDisplay.classList.contains(
                "hidden"
            ) /* cum verifici că ai date afișate? */
        ) {
            // Cum reîncărci cu noile setări?
            showLoading();
            displayWeather(
                await getCurrentWeather(elements.cityName.textContent)
            );
            hideLoading();
        }
    });

    elements.langSelect.addEventListener("change", async (e) => {
        // Logică similară pentru limbă
        const newLang = e.target.value;
        const currentPrefs = loadUserPreferences();
        saveUserPreferences(currentPrefs.unit, newLang);
        if (!elements.weatherDisplay.classList.contains("hidden")) {
            showLoading();
            displayWeather(
                await getCurrentWeather(elements.cityName.textContent)
            );
        }
        hideLoading();
    });

    // Event listeners pentru istoric
    addHistoryEventListeners(handleHistoryClick, handleClearHistory);
};

const handleSearch = async () => {
    // Validează input
    // Arată loading
    // Apelează weather service
    // Ascunde loading, arată rezultat
    // Gestionează erorile
    const city = getCityInput().trim();

    logger.debug("Search initiated", { city });

    if (!isValidCity(city)) {
        showError("Please enter a city name.");
        logger.warn("Invalid city input", { city });
        return;
    }

    showLoading();
    logger.info("Fetching weather data", { city });

    const data = await getCurrentWeather(city);
    hideLoading();
    if (!data) {
        showError("Could not fetch weather data. Please try again.");
        logger.error("Failed to fetch weather data", error);
        return;
    }

    // Salvează în istoric
    historyService.addLocation(data);

    displayWeather(data);

    // Reîncarcă istoricul
    const updatedHistory = historyService.getHistory();
    renderHistory(updatedHistory);
    showHistory();

    logger.info("Weather data displayed successfully", {
        city: data.name,
        temp: data.main.temp,
    });
};

const isValidCity = (city) => {
    // Gol? Prea scurt? Conține cifre/simboluri?
    return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\\s-]+$/.test(city);
};

// Nouă funcție pentru search din istoric
const handleHistoryClick = async (event) => {
    const historyItem = event.target.closest(".history-item");
    if (!historyItem) return;

    const city = historyItem.dataset.city;
    const lat = parseFloat(historyItem.dataset.lat);
    const lon = parseFloat(historyItem.dataset.lon);

    logger.info("History item clicked", { city, lat, lon });

    try {
        showLoading();

        // Folosește coordonatele pentru acuratețe
        const weatherData = await getWeatherByCoords(lat, lon);

        // Actualizează poziția în istoric (move to top)
        historyService.addLocation(weatherData);

        displayWeather(weatherData);

        // Reîncarcă istoricul
        const updatedHistory = historyService.getHistory();
        renderHistory(updatedHistory);

        logger.info("Weather loaded from history", { city });
    } catch (error) {
        showError("Nu am putut obține vremea din istoric.");
        logger.error("Failed to load weather from history", error);
    } finally {
        hideLoading();
    }
};

// Funcție pentru ștergerea istoricului
const handleClearHistory = () => {
    if (confirm("Sigur vrei să ștergi tot istoricul de căutări?")) {
        historyService.clearHistory();
        renderHistory([]);
        logger.info("Search history cleared");
    }
};

// Pornește setupEventListeners și displayWeather pentru a rula aplicația
const initializeApp = async () => {
    logger.info("Weather App starting...");

    setupEventListeners();
    const location = await getCoords();
    const data = await getWeatherByCoords(
        location.latitude,
        location.longitude
    );
    [...elements.langSelect.childNodes].forEach((option) => {
        if (option.value === loadUserPreferences().lang) {
            option.selected = true;
        }
    });
    [...elements.unitSelect.childNodes].forEach((option) => {
        if (option.value === loadUserPreferences().unit) {
            option.selected = true;
        }
    });
    hideLoading();
    displayWeather(data);
    loadHistoryOnStart();

    logger.info("Weather App initialized successfully");
};

// Nouă funcție pentru încărcarea istoricului
const loadHistoryOnStart = () => {
    const history = historyService.getHistory();
    if (history.length > 0) {
        renderHistory(history);
        showHistory();
        logger.info(`Loaded ${history.length} items from history`);
    }
};

initializeApp();
