import { formatTimeTo12Hour } from "../utils/timeUtils.js";
import { getPrayerTimesByCityName, suggesCities } from "../api/gitprayerByCity.js";

export async function renderPrayerTimes(data, locationName = "Makkah, Saudi Arabia") {
    const prayerTimesContent = document.querySelector(".prayer-times");

    prayerTimesContent.innerHTML = `
        ${navMobile(data, locationName)}

        ${navDesktop(data, locationName)}

        <div class="container">
            ${nextPrayerContent()}

            ${prayerTimescontent(data.timings)}
        </div>
    `;

    
    prayerTimesContent.querySelectorAll(".search-location input").forEach((input) => {
        input.addEventListener("input", suggesCities);
    });
    prayerTimesContent.querySelectorAll(".search-location button").forEach((button) => {
        button.addEventListener("click", getPrayerTimesByCityName);
    });
}
function navDesktop(data, locationName = "Makkah, Saudi Arabia") {
    return `
        <!-- DESKTOP NAV -->
        <nav class="d-flex justify-content-between align-items-center main-nav d-none d-lg-flex">
            <div class="logo-box d-flex">
                <svg stroke="currentColor" fill="#e0d3a6" stroke-width="0" viewBox="0 0 640 512" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M400 0c5 0 9.8 2.4 12.8 6.4c34.7 46.3 78.1 74.9 133.5 111.5c0 0 0 0 0 0s0 0 0 0c5.2 3.4 10.5 7 16 10.6c28.9 19.2 45.7 51.7 45.7 86.1c0 28.6-11.3 54.5-29.8 73.4l-356.4 0c-18.4-19-29.8-44.9-29.8-73.4c0-34.4 16.7-66.9 45.7-86.1c5.4-3.6 10.8-7.1 16-10.6c0 0 0 0 0 0s0 0 0 0C309.1 81.3 352.5 52.7 387.2 6.4c3-4 7.8-6.4 12.8-6.4zM288 512l0-72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 72-48 0c-17.7 0-32-14.3-32-32l0-128c0-17.7 14.3-32 32-32l416 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-48 0 0-72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 72-64 0 0-58c0-19-8.4-37-23-49.2L400 384l-25 20.8C360.4 417 352 435 352 454l0 58-64 0zM70.4 5.2c5.7-4.3 13.5-4.3 19.2 0l16 12C139.8 42.9 160 83.2 160 126l0 2L0 128l0-2C0 83.2 20.2 42.9 54.4 17.2l16-12zM0 160l160 0 0 136.6c-19.1 11.1-32 31.7-32 55.4l0 128c0 9.6 2.1 18.6 5.8 26.8c-6.6 3.4-14 5.2-21.8 5.2l-64 0c-26.5 0-48-21.5-48-48L0 176l0-16z"></path>
                </svg>
                <h3>Prayer Times</h3>
            </div>

            <div class="search-box position-relative">
                <div class="search-location">
                    <input type="search" placeholder="Enter city name" class='w-100'>
                    <button>Search</button>
                </div>
                <ul class="suggestions-list"></ul>
            </div>

            <div class="location-box d-flex flex-column align-items-center justify-content-center">
                <p class="location-name">${locationName}</p>
                <div class="meta-date">
                    <p>${data.date.readable} - ${data.date.hijri.day} ${data.date.hijri.month.en} ${data.date.hijri.year} AH</p>
                </div>
            </div>
        </nav>
    `;
}
function navMobile(data, locationName = "Makkah, Saudi Arabia") {
    return `
                <nav class="mobile-nav d-block d-lg-none">
            <div class="nav-top">
                <div class="logo-box">
                    <svg stroke="currentColor" fill="#e0d3a6" stroke-width="0" viewBox="0 0 640 512" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg">
                        <path d="M400 0c5 0 9.8 2.4 12.8 6.4c34.7 46.3 78.1 74.9 133.5 111.5c0 0 0 0 0 0s0 0 0 0c5.2 3.4 10.5 7 16 10.6c28.9 19.2 45.7 51.7 45.7 86.1c0 28.6-11.3 54.5-29.8 73.4l-356.4 0c-18.4-19-29.8-44.9-29.8-73.4c0-34.4 16.7-66.9 45.7-86.1c5.4-3.6 10.8-7.1 16-10.6c0 0 0 0 0 0s0 0 0 0C309.1 81.3 352.5 52.7 387.2 6.4c3-4 7.8-6.4 12.8-6.4zM288 512l0-72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 72-48 0c-17.7 0-32-14.3-32-32l0-128c0-17.7 14.3-32 32-32l416 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-48 0 0-72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 72-64 0 0-58c0-19-8.4-37-23-49.2L400 384l-25 20.8C360.4 417 352 435 352 454l0 58-64 0zM70.4 5.2c5.7-4.3 13.5-4.3 19.2 0l16 12C139.8 42.9 160 83.2 160 126l0 2L0 128l0-2C0 83.2 20.2 42.9 54.4 17.2l16-12zM0 160l160 0 0 136.6c-19.1 11.1-32 31.7-32 55.4l0 128c0 9.6 2.1 18.6 5.8 26.8c-6.6 3.4-14 5.2-21.8 5.2l-64 0c-26.5 0-48-21.5-48-48L0 176l0-16z"></path>
                    </svg>
                    <h3>Prayer Times</h3>
                </div>

                <div class="search-box">
                    <div class="search-location">
                        <input type="search" placeholder="Enter city name" class='w-100'>
                        <button>Search</button>
                    </div>
                    <ul class="suggestions-list"></ul>
                </div>
            </div>

            <div class="nav-bottom">
                <p class="location-name">${locationName}</p>
                <p class="meta-date">
                    ${data.date.readable} - ${data.date.hijri.day} ${data.date.hijri.month.en} ${data.date.hijri.year} AH
                </p>
            </div>
        </nav>
    `;
}
function nextPrayerContent() {
    return `
        <div class="next-prayer py-5 d-flex flex-column align-items-center justify-content-center">
            <h4>Next Prayer</h4>
            <div id="next-prayer-name"></div>
            <div id="countdown"></div>
        </div>
    `;
}
function prayerTimescontent(timings) {
    const mainPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    return `
        <div class="prayer-times-content d-flex flex-column flex-lg-row justify-content-center align-items-center py-5 gap-3">
            ${Object.entries(timings)
                .filter(([prayer]) => mainPrayers.includes(prayer))
                .map(([prayer, time]) => {
                    return `
                    <div class="item" data-prayer="${prayer}">
                        <div class="prayer-title">
                            ${svgIcon(prayer)}
                            <h5>${prayer}</h5>
                        </div>
                        <h3 class="prayer-time" data-prayer="${prayer}">${formatTimeTo12Hour(time)}</h3>
                    </div>
            `;
                })
                .join("")}
        </div>
    `;
}

function svgIcon(prayer) {
    const icons = {
        Fajr: `<svg stroke="currentColor" fill="#F5E6A1" stroke-width="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.3807 2.01886C9.91573 3.38768 9 5.3369 9 7.49999C9 11.6421 12.3579 15 16.5 15C18.6631 15 20.6123 14.0843 21.9811 12.6193C21.6613 17.8537 17.3149 22 12 22C6.47715 22 2 17.5228 2 12C2 6.68514 6.14629 2.33869 11.3807 2.01886Z"></path>
    </svg>`,
        Dhuhr: `<svg stroke="currentColor" fill="#F5E6A1" stroke-width="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="m6.76 4.84-1.8-1.79-1.41 1.41 1.79 1.79zM1 10.5h3v2H1zM11 .55h2V3.5h-2zm8.04 2.495 1.408 1.407-1.79 1.79-1.407-1.408zm-1.8 15.115 1.79 1.8 1.41-1.41-1.8-1.79zM20 10.5h3v2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-1 4h2v2.95h-2zm-7.45-.96 1.41 1.41 1.79-1.8-1.41-1.41z"></path></svg>`,
        Asr: `<svg stroke="currentColor" fill="#F5E6A1" stroke-width="0" viewBox="0 0 512 512" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path d="M288 124c30.3 0 59.3 11.2 81.8 31.5 22.3 20.1 36.3 47.6 39.5 77.3l1.2 11.1c.6 5.8 5 10.5 10.7 11.5l11 2c14 2.5 27 10.4 36.7 22.1 9.8 12 15.2 26.9 15.2 42.1 0 17-6.9 34.1-18.9 46.8C453 381 437.4 388 421.1 388H90.9c-16.3 0-31.9-7-43.9-19.7s-18.9-29.7-18.9-46.8c0-14.4 4.6-28.9 13.1-40.9 8.6-12.2 20.2-20.9 33.7-25.1l10.3-3.3c5.3-1.7 9-6.6 9.1-12.2l.2-10.8c.2-11.8 5.1-23.6 13.5-32.4 8.3-8.7 18.9-13.4 29.9-13.4 5.6 0 11.1 1.1 16.3 3.2l11.1 4.5c5.7 2.3 12.2.4 15.7-4.7l6.8-9.8C210.4 143.7 248 124 288 124m0-28c-51.2 0-96.3 25.6-123.4 64.7-8.3-3.4-17.4-5.3-26.9-5.3-39.1 0-70.8 34.4-71.4 73.4C26.4 241.5 0 280.5 0 321.5 0 371.7 40.7 416 90.9 416h330.3c50.2 0 90.9-44.3 90.9-94.5 0-44.7-32.3-84.1-74.9-91.7C429 154.6 365.4 96 288 96z"></path></svg>`,
        Maghrib: `<svg stroke="#F5E6A1" fill="#F5E6A1" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path d="M12 10V2"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path><path d="M20 18h2"></path><path d="m19.07 10.93-1.41 1.41"></path><path d="M22 22H2"></path><path d="m16 6-4 4-4-4"></path><path d="M16 18a4 4 0 0 0-8 0"></path></svg>`,
        Isha: `<svg stroke="currentColor" fill="#F5E6A1" stroke-width="0" viewBox="0 0 16 16" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"></path><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"></path></svg>`,
    };
    return icons[prayer];
}