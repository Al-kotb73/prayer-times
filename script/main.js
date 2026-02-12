const MAKKAH_COORDINATES = {
    lat: 21.4266,
    lon: 39.8256,
};
let countdownInterval;

function allowLocation() {
    document.getElementById("locationPopup").style.display = "none";
    getPrayerTimesByUserLocation();
}

function denyLocation() {
    document.getElementById("locationPopup").style.display = "none";
    handleCoordinates(MAKKAH_COORDINATES);
}

function getPrayerTimesByUserLocation() {
    if (!navigator.geolocation) {
        return;
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

function getPrayerTimesByCityName() {
    const cityInput = document.querySelector(".search-location input").value;
    console.log(cityInput);
    const url = `https://nominatim.openstreetmap.org/search?q=${cityInput}&format=json&limit=1&accept-language=en`;
    axios
        .get(url)
        .then((response) => {
            const location = response.data[0];
            console.log(location);
            return (coordinates = {
                lat: location.lat,
                lon: location.lon,
            });
        })
        .then((coordinates) => {
            handleCoordinates(coordinates);
        })
        .catch((error) => {
            console.log(error);
        });
    cityInput.value = "";
}
async function suggesCities() {
    const cityInput = document.querySelector(".search-location input");
    const suggestionsList = document.querySelector(".suggestions-list");
    console.log(suggestionsList);
    const query = cityInput.value;
    if (query.length < 3) {
        suggestionsList.innerHTML = "";
        console.log(query.length);
        return;
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5&accept-language=en`;
    try {
        const response = await axios.get(url);
        const locations = response.data;
        console.log(locations);
        suggestionsList.innerHTML = "";
        locations.forEach((location) => {
            const listItem = document.createElement("li");
            const address = location.display_name.split(",").slice(0, 3).join(", ");
            console.log(address);
            listItem.textContent = `${address}`;
            listItem.onclick = () => {
                cityInput.value = location.display_name;
                suggestionsList.innerHTML = "";
            };
            suggestionsList.appendChild(listItem);
        });
    } catch (error) {
        console.log(error);
    }
}

async function handleCoordinates(coordinates) {
    await getPrayerTimes(coordinates.lat, coordinates.lon);
    await getLocation(coordinates.lat, coordinates.lon);
}
async function getPrayerTimes(latitude, longitude) {
    await axios
        .get(`https://api.aladhan.com/v1/timings`, {
            params: {
                latitude: latitude,
                longitude: longitude,
                method: 5,
            },
        })
        .then(function (response) {
            let data = response.data.data;
            console.log(data);
            return data;
        })
        .then(function (data) {
            // handle success
            console.log(data);
            renderPrayerTimes(data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}
function startNextPrayerCountdown(timings) {
    const prayerOrder = [
        { name: "Fajr", time: timings.Fajr },
        { name: "Dhuhr", time: timings.Dhuhr },
        { name: "Asr", time: timings.Asr },
        { name: "Maghrib", time: timings.Maghrib },
        { name: "Isha", time: timings.Isha },
    ];
    const now = new Date();
    let nextPrayer = null;
    for (let prayer of prayerOrder) {
        const [hours, minutes] = prayer.time.split(":");
        const prayerTime = new Date();
        prayerTime.setHours(hours, minutes, 0, 0);
        console.log(prayerTime, now);
        if (prayerTime > now) {
            console.log(prayerTime, now);
            nextPrayer = { ...prayer, date: prayerTime };

            break;
        }
    }
    if (!nextPrayer) {
        const [hours, minutes] = timings.Fajr.split(":");
        const fajrTomorrow = new Date();
        fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
        fajrTomorrow.setHours(hours, minutes, 0, 0);
        nextPrayer = {
            name: "Fajr",
            time: timings.Fajr,
            date: fajrTomorrow,
        };
    }
    let nextPrayerNameElem = document.getElementById("next-prayer-name");
    nextPrayerNameElem.innerHTML = `
    <h3>${nextPrayer.name}</h3>
    <p>Start at ${nextPrayer.time} ${nextPrayer.date.getHours() >= 12 ? "PM" : "AM"}  </p>
    `;
    countdownInterval = setInterval(() => {
        const now = new Date();
        const timeDiff = nextPrayer.date - now;
        if (timeDiff <= 0) {
            clearInterval(countdownInterval);
            startNextPrayerCountdown(timings);
            return;
        }

        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        let countdownElem = document.getElementById("countdown");
        countdownElem.innerHTML = `<div class='box-countdown'>
            <h1>${hours}</h1>
            <p>Hours</p>
        </div>
        <p>:</p>
        <div class='box-countdown'>
            <h1>${minutes}</h1>
            <p>Minutes</p>
        </div>
        <p>:</p>
        <div class='box-countdown'>
            <h1>${seconds}</h1>
            <p>Seconds</p>
        </div>
        `;

        setActivePrayer(nextPrayer.name);
    }, 1000);
}

// render prayer times on page load
async function renderPrayerTimes(data) {
    let prayerTimesContent = document.querySelector(".prayer-times");
    console.log(data.meta.longitude, data.meta.latitude);

    prayerTimesContent.innerHTML = `
        <div class="prayer-times">
        <nav class="mobile-nav d-block d-lg-none">

    <!-- Top Row -->
    <div class="nav-top">
        <div class="logo-box">
                <svg stroke="currentColor" fill="#e0d3a6" stroke-width="0" viewBox="0 0 640 512" height="30px"
                    width="30px" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M400 0c5 0 9.8 2.4 12.8 6.4c34.7 46.3 78.1 74.9 133.5 111.5c0 0 0 0 0 0s0 0 0 0c5.2 3.4 10.5 7 16 10.6c28.9 19.2 45.7 51.7 45.7 86.1c0 28.6-11.3 54.5-29.8 73.4l-356.4 0c-18.4-19-29.8-44.9-29.8-73.4c0-34.4 16.7-66.9 45.7-86.1c5.4-3.6 10.8-7.1 16-10.6c0 0 0 0 0 0s0 0 0 0C309.1 81.3 352.5 52.7 387.2 6.4c3-4 7.8-6.4 12.8-6.4zM288 512l0-72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 72-48 0c-17.7 0-32-14.3-32-32l0-128c0-17.7 14.3-32 32-32l416 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-48 0 0-72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 72-64 0 0-58c0-19-8.4-37-23-49.2L400 384l-25 20.8C360.4 417 352 435 352 454l0 58-64 0zM70.4 5.2c5.7-4.3 13.5-4.3 19.2 0l16 12C139.8 42.9 160 83.2 160 126l0 2L0 128l0-2C0 83.2 20.2 42.9 54.4 17.2l16-12zM0 160l160 0 0 136.6c-19.1 11.1-32 31.7-32 55.4l0 128c0 9.6 2.1 18.6 5.8 26.8c-6.6 3.4-14 5.2-21.8 5.2l-64 0c-26.5 0-48-21.5-48-48L0 176l0-16z">
                    </path>

                </svg>
                <h3>Prayer Times</h3>
        </div>

        <div class="search-box">
                <div class="search-location">
                    <input type="search" name="" id="" oninput="suggesCities()" placeholder="Enter city name"class='w-100'>
                    <button onclick="getPrayerTimesByCityName()">Search</button>
                </div>
                                <ul class="suggestions-list"></ul>


        </div>
    </div>

    <!-- Bottom Row -->
    <div class="nav-bottom">
        <p class="location-name">
            Makkah, Saudi Arabia
        </p>
        <p class="meta-date">
                                ${data.date.readable} - ${data.date.hijri.day} ${data.date.hijri.month.en} ${data.date.hijri.year} AH

        </p>
    </div>

</nav>

        <nav class="d-flex justify-content-between align-items-center main-nav d-none d-lg-flex">
            <div class=" logo-box d-flex  ">
                <svg stroke="currentColor" fill="#e0d3a6" stroke-width="0" viewBox="0 0 640 512" height="30px"
                    width="30px" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M400 0c5 0 9.8 2.4 12.8 6.4c34.7 46.3 78.1 74.9 133.5 111.5c0 0 0 0 0 0s0 0 0 0c5.2 3.4 10.5 7 16 10.6c28.9 19.2 45.7 51.7 45.7 86.1c0 28.6-11.3 54.5-29.8 73.4l-356.4 0c-18.4-19-29.8-44.9-29.8-73.4c0-34.4 16.7-66.9 45.7-86.1c5.4-3.6 10.8-7.1 16-10.6c0 0 0 0 0 0s0 0 0 0C309.1 81.3 352.5 52.7 387.2 6.4c3-4 7.8-6.4 12.8-6.4zM288 512l0-72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 72-48 0c-17.7 0-32-14.3-32-32l0-128c0-17.7 14.3-32 32-32l416 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-48 0 0-72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 72-64 0 0-58c0-19-8.4-37-23-49.2L400 384l-25 20.8C360.4 417 352 435 352 454l0 58-64 0zM70.4 5.2c5.7-4.3 13.5-4.3 19.2 0l16 12C139.8 42.9 160 83.2 160 126l0 2L0 128l0-2C0 83.2 20.2 42.9 54.4 17.2l16-12zM0 160l160 0 0 136.6c-19.1 11.1-32 31.7-32 55.4l0 128c0 9.6 2.1 18.6 5.8 26.8c-6.6 3.4-14 5.2-21.8 5.2l-64 0c-26.5 0-48-21.5-48-48L0 176l0-16z">
                    </path>

                </svg>
                <h3>
                    Prayer Times
                </h3>
            </div>
            <div class="search-box  position-relative">
                <div class="search-location">
                    <input type="search" name="" id="" oninput="suggesCities()" placeholder="Enter city name"class='w-100'>
                    <button onclick="getPrayerTimesByCityName()">Search</button>
                </div>
                <ul class="suggestions-list"></ul>

            </div>

            <div class="location-box  d-flex flex-column align-items-center justify-content-center">
                <p class="location-name">
                    <svg stroke="currentColor" fill="#e0d3a6" stroke-width="0" viewBox="0 0 512 512" height="25px"
                        width="25px" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="256" cy="192" r="32"></circle>
                        <path
                            d="M256 32c-88.22 0-160 68.65-160 153 0 40.17 18.31 93.59 54.42 158.78 29 52.34 62.55 99.67 80 123.22a31.75 31.75 0 0 0 51.22 0c17.42-23.55 51-70.88 80-123.22C397.69 278.61 416 225.19 416 185c0-84.35-71.78-153-160-153zm0 224a64 64 0 1 1 64-64 64.07 64.07 0 0 1-64 64z">
                        </path>
                    </svg>
                    Makkah, Saudi Arabia
                </p>
                <div class="meta-date">
                    <p>
                        ${data.date.readable} - ${data.date.hijri.day} ${data.date.hijri.month.en} ${data.date.hijri.year} AH
                    </p>
                </div>
            </div>
        </nav>
        <div class="container">
            
                        
            
            <div class="next-prayer py-5 d-flex flex flex-column align-items-center justify-content-center">
                <h4>Next Prayer</h4>
                <div id="next-prayer-name">
  
                </div>
                <div id="countdown"></div>
            </div>

            <div class="prayer-times-content d-flex flex-column flex-lg-row justify-content-center align-items-center  py-5 gap-3">


                <div class="item  " data-prayer="Isha">
                    <div class="prayer-title ">
                    <svg stroke="currentColor" fill="#F5E6A1" stroke-width="0" viewBox="0 0 24 24" height="30px"
                        width="30px" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M11.3807 2.01886C9.91573 3.38768 9 5.3369 9 7.49999C9 11.6421 12.3579 15 16.5 15C18.6631 15 20.6123 14.0843 21.9811 12.6193C21.6613 17.8537 17.3149 22 12 22C6.47715 22 2 17.5228 2 12C2 6.68514 6.14629 2.33869 11.3807 2.01886Z">
                        </path>
                    </svg>
                        <h5>Isha</h5>
                    </div>

                    <h3 id="fajr-time">${data.timings.Isha} PM </h3>
                </div>
                <div class="item  " data-prayer="Maghrib">
                    <div class="prayer-title  ">
                    <svg stroke="#F5E6A1" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
                        stroke-linejoin="round" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 13h1"></path>
                        <path d="M20 13h1"></path>
                        <path d="M5.6 6.6l.7 .7"></path>
                        <path d="M18.4 6.6l-.7 .7"></path>
                        <path d="M8 13a4 4 0 1 1 8 0"></path>
                        <path d="M3 17h18"></path>
                        <path d="M7 20h5"></path>
                        <path d="M16 20h1"></path>
                        <path d="M12 5v-1"></path>
                    </svg>
                        <h5>Maghrib</h5>
                    </div>

                    <h3 id="fajr-time">${data.timings.Maghrib} PM</h3>
                </div>
                <div class="item  " data-prayer="Asr">
                    <div class="prayer-title  ">
                    <svg stroke="currentColor" fill="#F5E6A1" stroke-width="0" viewBox="0 0 16 16" height="30px"
                        width="30px" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7 8a3.5 3.5 0 0 1 3.5 3.555.5.5 0 0 0 .624.492A1.503 1.503 0 0 1 13 13.5a1.5 1.5 0 0 1-1.5 1.5H3a2 2 0 1 1 .1-3.998.5.5 0 0 0 .51-.375A3.5 3.5 0 0 1 7 8m4.473 3a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 16h8.5a2.5 2.5 0 0 0 0-5z">
                        </path>
                        <path
                            d="M10.5 1.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0zm3.743 1.964a.5.5 0 1 0-.707-.707l-.708.707a.5.5 0 0 0 .708.708zm-7.779-.707a.5.5 0 0 0-.707.707l.707.708a.5.5 0 1 0 .708-.708zm1.734 3.374a2 2 0 1 1 3.296 2.198q.3.423.516.898a3 3 0 1 0-4.84-3.225q.529.017 1.028.129m4.484 4.074c.6.215 1.125.59 1.522 1.072a.5.5 0 0 0 .039-.742l-.707-.707a.5.5 0 0 0-.854.377M14.5 6.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z">
                        </path>
                    </svg>
                        <h5>Asr</h5>
                    </div>

                    <h3 id="fajr-time">${data.timings.Asr} PM</h3>
                </div>
                <div class="item  " data-prayer="Dhuhr">
                    <div class="prayer-title ">
                    <svg stroke="currentColor" fill="#F5E6A1" stroke-width="0" viewBox="0 0 512 512" height="30px"
                        width="30px" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M256 118a22 22 0 0 1-22-22V48a22 22 0 0 1 44 0v48a22 22 0 0 1-22 22zm0 368a22 22 0 0 1-22-22v-48a22 22 0 0 1 44 0v48a22 22 0 0 1-22 22zm113.14-321.14a22 22 0 0 1-15.56-37.55l33.94-33.94a22 22 0 0 1 31.11 31.11l-33.94 33.94a21.93 21.93 0 0 1-15.55 6.44zM108.92 425.08a22 22 0 0 1-15.55-37.56l33.94-33.94a22 22 0 1 1 31.11 31.11l-33.94 33.94a21.94 21.94 0 0 1-15.56 6.45zM464 278h-48a22 22 0 0 1 0-44h48a22 22 0 0 1 0 44zm-368 0H48a22 22 0 0 1 0-44h48a22 22 0 0 1 0 44zm307.08 147.08a21.94 21.94 0 0 1-15.56-6.45l-33.94-33.94a22 22 0 0 1 31.11-31.11l33.94 33.94a22 22 0 0 1-15.55 37.56zM142.86 164.86a21.89 21.89 0 0 1-15.55-6.44l-33.94-33.94a22 22 0 0 1 31.11-31.11l33.94 33.94a22 22 0 0 1-15.56 37.55zM256 358a102 102 0 1 1 102-102 102.12 102.12 0 0 1-102 102z">
                        </path>
                    </svg>
                        <h5>Dhuhr</h5>
                    </div>

                    <h3 id="fajr-time">${data.timings.Dhuhr} PM</h3>
                </div>
                <div class="item d-flex   " data-prayer="Fajr">
                    <div class="prayer-title ">
                    <svg stroke="currentColor" fill="#F5E6A1" stroke-width="0" viewBox="0 0 332 512" class="d-block"
                        height="30px" width="30px" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M332.5 419.9c0 46.4-37.6 84.1-84 84.1s-84-37.7-84-84.1 37.6-84 84-84 84 37.6 84 84zm-84-243.9c46.4 0 80-37.6 80-84s-33.6-84-80-84-88 37.6-88 84-29.6 76-76 76-84 41.6-84 88 37.6 80 84 80 84-33.6 84-80 33.6-80 80-80z">
                        </path>
                    </svg>
                        <h5>Fajr</h5>
                    </div>

                    <h3 id="fajr-time">${data.timings.Fajr} AM</h3>
                </div>
            </div>
        </div>
    </div>


    `;
    startNextPrayerCountdown(data.timings);
}

function setActivePrayer(prayerName) {
    document.querySelectorAll(".item").forEach((item) => {
        item.classList.remove("active");
    });

    const activeItem = document.querySelector(`.item[data-prayer="${prayerName}"]`);

    if (activeItem) {
        activeItem.classList.add("active");
    }
}

async function getLocation(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`;
    const response = await axios.get(url);
    const data = response.data;
    const address = data.address;
    console.log(address);
    const city = address.city || address.town || address.village || address.county || address.state;
    const country = address.country;
    let prayerTimesContent = document.querySelector(".location-name");
    prayerTimesContent.innerHTML = `                     <svg stroke="currentColor" fill="#e0d3a6" stroke-width="0" viewBox="0 0 512 512" height="25px"
                        width="25px" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="256" cy="192" r="32"></circle>
                        <path
                            d="M256 32c-88.22 0-160 68.65-160 153 0 40.17 18.31 93.59 54.42 158.78 29 52.34 62.55 99.67 80 123.22a31.75 31.75 0 0 0 51.22 0c17.42-23.55 51-70.88 80-123.22C397.69 278.61 416 225.19 416 185c0-84.35-71.78-153-160-153zm0 224a64 64 0 1 1 64-64 64.07 64.07 0 0 1-64 64z">
                        </path>
                    </svg> ${city}, ${country}`;
}
