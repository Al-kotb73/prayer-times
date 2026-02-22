export async function getPrayerTimes(latitude, longitude) {
    const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=5`;
    try {
        const response = await axios.get(url);
        const data = response.data.data;
        return data;
    } catch (error) {
        console.log(error);
    }
}
