// Ce module noi trebuie importate?
import { getCoords } from "./modules/location-service.js";
import {
    getCurrentWeather,
    getWeatherByCoords,
} from "./modules/weather-service.js";
import {
    saveUserPreferences,
    loadUserPreferences,
} from "./modules/ui-controller.js";
import {
    showLoading,
    showError,
    displayWeather,
    elements,
    hideLoading,
    getCityInput,
} from "./modules/ui-controller.js";

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
};

const handleSearch = async () => {
    // Validează input
    // Arată loading
    // Apelează weather service
    // Ascunde loading, arată rezultat
    // Gestionează erorile
    const city = getCityInput().trim();
    if (!isValidCity(city)) {
        showError("Please enter a city name.");
        return;
    }

    showLoading();
    const data = await getCurrentWeather(city);
    hideLoading();
    if (!data) {
        showError("Could not fetch weather data. Please try again.");
        return;
    }
    displayWeather(data);
};

const isValidCity = (city) => {
    // Gol? Prea scurt? Conține cifre/simboluri?
    return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\\s-]+$/.test(city);
};

// Pornește setupEventListeners și displayWeather pentru a rula aplicația
setupEventListeners();
const location = await getCoords();
const data = await getWeatherByCoords(location.latitude, location.longitude);
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
