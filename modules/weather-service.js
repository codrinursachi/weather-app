import { MOCK_DATA } from "./config.js";
export const getCurrentWeather = async (city) => {
    // Simulează delay API (~1 secundă)
    // Returnează MOCK_DATA cu numele orașului actualizat
    // Gestionează erorile
    try {
        if (!city) {
            throw new Error("City name is required");
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { ...MOCK_DATA, name: city };
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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { ...MOCK_DATA, coord: { lat, lon } };
    } catch (error) {
        console.error("Error fetching weather data by coordinates:", error);
    }
};
