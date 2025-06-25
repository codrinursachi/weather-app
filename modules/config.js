// Cum arată datele unei API meteo?
// Temperatură, umiditate, vânt, descriere...
export const MOCK_DATA = {
    main: {
        temp: 284.2,
        feels_like: 282.93,
        temp_min: 283.06,
        temp_max: 286.82,
        pressure: 1021,
        humidity: 60,
        sea_level: 1021,
        grnd_level: 910,
    },
    weather: [
        {
            id: 501,
            main: "Rain",
            description: "moderate rain",
            icon: "10d",
        },
    ],
    coord: {
        lon: 7.367,
        lat: 45.133,
    },
    base: "stations",
    visibility: 10000,
    wind: {
        speed: 4.09,
        deg: 121,
        gust: 3.47,
    },
    rain: {
        "1h": 2.73,
    },
    clouds: {
        all: 83,
    },
    dt: 1726660758,
    sys: {
        type: 1,
        id: 6736,
        country: "IT",
        sunrise: 1726636384,
        sunset: 1726680975,
    },
    timezone: 7200,
    id: 3165523,
    name: "Province of Turin",
    cod: 200,
};

// Ce informații sunt comune pentru toate request-urile API?
export const CONFIG = {
    API_KEY: 'e6a3582490291502913a6c4fab652b59', // Unde obții asta?
    API_BASE_URL: "https://api.openweathermap.org/data/2.5"/* care este URL-ul de bază? */,
    DEFAULT_UNITS: "metric"/* metric sau imperial? */,
    DEFAULT_LANG: "ro"/* ro, en, sau altceva? */
  }
  
  // Cum organizezi endpoint-urile pentru a fi ușor de găsit?
  export const API_ENDPOINTS = {
    CURRENT_WEATHER: "/weather"/* ce endpoint pentru vremea curentă? */,
    FORECAST: "/forecast"/* ce endpoint pentru prognoză? */,
    // Ce alte endpoint-uri ai putea avea nevoie?
  }
  
  // Ce mesaje sunt utile când ceva merge prost?
  export const ERROR_MESSAGES = {
    CITY_NOT_FOUND: "Orasul nu a fost gasit"/* ce mesaj prietenos? */,
    NETWORK_ERROR: "Nu s-a putut conecta la retea"/* ce mesaj când nu ai internet? */,
    // Ce alte erori pot apărea?
}
