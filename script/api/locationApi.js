export async function getLocation(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`;
    const response = await axios.get(url);
    const data = response.data;
    const address = data.address;
    
    const city = address.city || address.town || address.village || address.county || address.state;
    const country = address.country;
    return { city, country };
}
