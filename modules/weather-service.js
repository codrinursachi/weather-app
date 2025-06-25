import { MOCK_DATA, CONFIG } from "./config.js";
import { loadUserPreferences } from "./ui-controller.js";
export const getCurrentWeather = async (city) => {
    // Simulează delay API (~1 secundă)
    // Returnează MOCK_DATA cu numele orașului actualizat
    // Gestionează erorile
    try {
        if (!city) {
            throw new Error("City name is required");
        }
        try {
            return makeRequest(buildUrl("/weather", { q: city }));
        } catch (error) {
            console.warn("Using fallback data due to:", error.message);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return { ...MOCK_DATA, name: city };
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
};

export const getWeatherByCoords = async (lat, lon) => {
    // Similar, dar pentru coordonate
    try {
        if (typeof lat !== "number" || typeof lon !== "number") {
            throw new Error("Latitude and longitude must be numbers");
        }
        try {
            return makeRequest(buildUrl("/weather", { lat, lon }));
        } catch (error) {
            console.warn("Using fallback data due to:", error.message);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return { ...MOCK_DATA, coord: { lat, lon } };
        }
    } catch (error) {
        console.error("Error fetching weather data by coordinates:", error);
    }
};

// În modules/weather-service.js
const buildUrl = (endpoint, params = {}) => {
    // Cum combini base URL cu endpoint?
    const url = new URL(CONFIG.API_BASE_URL + endpoint);
    const settings = loadUserPreferences();
    // Ce parametri sunt întotdeauna necesari?
    url.searchParams.set("appid", CONFIG.API_KEY /* de unde iei API key? */);
    url.searchParams.set("units", settings.unit /* ce unități folosești? */);
    url.searchParams.set("lang", settings.lang /* ce limbă folosești? */);

    // Cum adaugi parametrii specifici (city, lat, lon)?
    Object.entries(params).forEach(([key, value]) => {
        if (value /* cum verifici că value există și nu e gol? */) {
            url.searchParams.set(key, value);
        }
    });

    return url.toString();
};

const makeRequest = async (url) => {
    try {
        const response = await fetch(url);

        // Cum verifici că request-ul a fost successful?
        if (!response.ok) {
            // Status 404 = ?
            if (response.status === 404) {
                throw new Error("Orasul nu a fost gasit.");
            }
            // Status 401 = ?
            if (response.status === 401) {
                throw new Error("Cheia API este invalida.");
            }
            // Status 500 = ?
            if (response.status === 500) {
                throw new Error("Eroare interna a serverului.");
            }
            throw new Error(
                "Am intampinat o eroare necunoscuta" /* ce mesaj prietenos? */
            );
        }

        return await response.json();
    } catch (error) {
        // Cum distingi între network error și API error?
        // Ce mesaj afișezi utilizatorului?
        throw new Error(
            "Nu s-a putut efectua conexiunea." /* mesaj adaptat tipului de eroare */
        );
    }
};
