import { CONFIG } from "./config.js";

export class HistoryService {
    constructor() {
        this.storageKey = CONFIG.STORAGE_KEYS.SEARCH_HISTORY;
        this.maxItems = CONFIG.MAX_HISTORY_ITEMS;
    }

    addLocation(weatherData) {
        // Extrage informațiile relevante din weatherData
        // Verifică dacă locația există deja (evită duplicate)
        // Dacă există, mută-o în top
        // Dacă nu, adaugă-o la început
        // Limitează la maxItems
        // Salvează în localStorage
        // Loghează acțiunea
        const weatherItem = {
            city: weatherData.name,
            country: weatherData.sys.country,
            timestamp: new Date().valueOf(),
            coordinates: {
                lat: weatherData.coord.lat,
                lon: weatherData.coord.lon,
            },
        };
        this.removeLocation(weatherItem.city);
        const history = this._loadFromStorage();
        history.unshift(weatherItem);
        if (history.length > this.maxItems) {
            history.pop();
        }
        this._saveToStorage(history);
    }

    getHistory() {
        // Citește din localStorage
        // Returnează array-ul sau array gol dacă nu există
        return this._loadFromStorage();
    }

    removeLocation(city) {
        // Elimină o locație specifică din istoric
        // Salvează în localStorage
        const history = this._loadFromStorage();
        const updatedHistory = history.filter(item => item.city !== city);
        this._saveToStorage(updatedHistory);
    }

    clearHistory() {
        // Șterge tot istoricul
        // Salvează în localStorage
        localStorage.removeItem(this.storageKey);
    }

    _saveToStorage(history) {
        // Salvează array-ul în localStorage
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(history));
        } catch (error) {
            console.error("Failed to save to localStorage", error);
        }
    }

    _loadFromStorage() {
        // Încarcă din localStorage
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Failed to load from localStorage", error);
            return [];
        }
    }
}

export const historyService = new HistoryService();
