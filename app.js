import ui from "./modules/ui-controller.js";
import { getCurrentWeather } from "./modules/weather-service.js";
import config from "./modules/config.js";

const setupEventListeners = () => {
    // Submit în form (enter din search field sau click pe buton)
    const form = document.querySelector("#city-search-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Previne reload-ul paginii
        handleSearch();
    });
};

const handleSearch = async () => {
    // Validează input
    // Arată loading
    // Apelează weather service
    // Ascunde loading, arată rezultat
    // Gestionează erorile
    const city = ui.getCityInput().trim();
    if (!isValidCity(city)) {
        ui.showError("Please enter a city name.");
        return;
    }

    ui.showLoading();
    const data = await getCurrentWeather(city);
    if (!data) {
        ui.showError("Could not fetch weather data. Please try again.");
        ui.hideLoading();
        return;
    }
    ui.hideLoading();
    ui.displayWeather(data);
    ui.clearCityInput();
};

const isValidCity = (city) => {
    // Gol? Prea scurt? Conține cifre/simboluri?
    return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\\s-]+$/.test(city);
};

// Pornește setupEventListeners și displayWeather pentru a rula aplicația
setupEventListeners();
ui.hideLoading();
ui.displayWeather(config.MOCK_DATA);
