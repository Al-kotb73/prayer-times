export function formatTimeTo12Hour(time) {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);

    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
}
