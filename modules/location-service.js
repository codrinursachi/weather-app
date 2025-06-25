// modules/location-service.js
export const getCoords = () =>
    new Promise((resolve, reject) => {
        // Funcția de fallback - când geolocation eșuează
        const fallbackToIp = async () => {
            try {
                // Ce API public oferă locația bazată pe IP?
                // Hint: încearcă <https://ipapi.co/json/> - este gratuit și nu necesită API key
                const response = await fetch(
                    "https://ipapi.co/json/" /* ce URL folosești? */
                );
                const data = await response.json();

                // Ce proprietăți returnează pentru coordonate?
                // Hint: verifică în browser console ce structură are răspunsul
                resolve({
                    latitude: data.latitude /* unde găsești latitude? */,
                    longitude: data.longitude /* unde găsești longitude? */,
                    source: "ip",
                    accuracy: "city", // IP location e mai puțin precisă
                });
            } catch (error) {
                // Ce faci când nici IP location nu funcționează?
                reject(new Error("Nu am putut determina locația"));
            }
        };

        // Verifică dacă browser-ul suportă geolocation
        if (!navigator.geolocation) {
            return fallbackToIp();
        }

        // Încearcă geolocation mai întâi
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Cum extragi coordonatele din position?
                resolve({
                    latitude: position.coords.latitude /* unde găsești? */,
                    longitude: position.coords.longitude /* unde găsești? */,
                    source: "gps",
                    accuracy: "precise",
                });
            },
            (error) => {
                // Ce tipuri de erori pot apărea?
                // PERMISSION_DENIED = ?
                // POSITION_UNAVAILABLE = ?
                // TIMEOUT = ?
                console.warn("Geolocation failed:", error.message);
                fallbackToIp();
            },
            {
                // Ce opțiuni sunt utile?
                timeout: 5000 /* cât aștepți? */,
                enableHighAccuracy: true /* true sau false? */,
                maximumAge:
                    1000 * 60 /* cât de vechi poate fi o locație cached? */,
            }
        );
    });
