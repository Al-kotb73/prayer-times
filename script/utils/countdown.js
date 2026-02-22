import { formatTimeTo12Hour } from "../utils/timeUtils.js";

let countdownInterval;


export function startNextPrayerCountdown(timings) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

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
<p>Start at ${formatTimeTo12Hour(nextPrayer.time)}</p>
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

function setActivePrayer(prayerName) {
    document.querySelectorAll(".item").forEach((item) => {
        item.classList.remove("active");
    });

    const activeItem = document.querySelector(`.item[data-prayer="${prayerName}"]`);

    if (activeItem) {
        activeItem.classList.add("active");
    }
}
