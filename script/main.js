import { getPrayerTimes } from "./api/prayerApi.js";
import { getLocation } from "./api/locationApi.js";
import { renderPrayerTimes } from "./ui/render.js";
import { startNextPrayerCountdown } from "./utils/countdown.js";

const MAKKAH_COORDINATES = {
    lat: 21.4266,
    lon: 39.8256,
};


function getPrayerTimesByUserLocation() {
    if (!navigator.geolocation) {
        handleCoordinates(MAKKAH_COORDINATES);
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const coordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        };
        console.log(coordinates);
        if (coordinates) {
            handleCoordinates(coordinates);
        }
    });
}



async function handleCoordinates(coordinates) {
    try {
        // fetch both pieces of data before rendering so we can show city immediately
        const [prayerData, locationData] = await Promise.all([
            getPrayerTimes(coordinates.lat, coordinates.lon),
            getLocation(coordinates.lat, coordinates.lon),
        ]);

        const locationName = `${locationData.city}, ${locationData.country}`;
        renderPrayerTimes(prayerData, locationName);
        startNextPrayerCountdown(prayerData.timings);
    } catch (error) {
        console.log(error);
    }
}

// expose controller function to other modules/UI callbacks
window.handleCoordinates = handleCoordinates;

getPrayerTimesByUserLocation();