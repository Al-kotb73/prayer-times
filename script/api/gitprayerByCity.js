
let debounceTimeout;
let currentController;
let prayerController;
export async function getPrayerTimesByCityName() {
    try {
        if (prayerController) {
            prayerController.abort();
        }
        prayerController = new AbortController();

        const Input = document.querySelector(".search-location input");
        const suggestionsList = document.querySelector(".suggestions-list");
        const cityInput = Input.value;
        const url = `https://nominatim.openstreetmap.org/search?q=${cityInput}&format=json&limit=1&accept-language=en`;
        const response = await axios.get(url, { signal: prayerController.signal });
        const locations = response.data[0];
        const coordinates = {
            lat: locations.lat,
            lon: locations.lon,
        };
        // call controller exposed on global object
        if (window.handleCoordinates) {
            window.handleCoordinates(coordinates);
        }
        Input.value = "";
        suggestionsList.innerHTML = "";
    } catch (error) {
        document.querySelector(".suggestions-list").innerHTML = `<li class="not-found">City not found</li>`;
    }
}
export async function suggesCities() {
    const cityInput = document.querySelector(".search-location input");
    const suggestionsList = document.querySelector(".suggestions-list");
    const query = cityInput.value;

    if (query.length < 3) {
        suggestionsList.innerHTML = "";
        return;
    }
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
        if (currentController) {
            currentController.abort();
        }
        currentController = new AbortController();
        const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5&accept-language=en`;
        try {
            const response = await axios.get(url, { signal: currentController.signal });
            const locations = response.data;

            suggestionsList.innerHTML = "";

            if (!locations.length) {
                suggestionsList.innerHTML = `<li class="not-found">City not found</li>`;
                return;
            }

            locations.forEach((location) => {
                const listItem = document.createElement("li");
                const address = location.display_name.split(",").slice(0, 3).join(", ");
                listItem.textContent = `${address}`;
                listItem.onclick = () => {
                    cityInput.value = location.display_name;
                    suggestionsList.innerHTML = "";
                };
                suggestionsList.appendChild(listItem);
            });
        } catch (error) {
            console.log(error);
            suggestionsList.innerHTML = `<li class="not-found">City not found</li>`;
        }
    }, 500);
}
