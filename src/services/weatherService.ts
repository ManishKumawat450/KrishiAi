import axios from 'axios';

const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://nominatim.openstreetmap.org/reverse';

export interface WeatherResult {
    location: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    description: string;
    icon: string;
    pressure: number;
    visibility: number;
    farmingSuitability: {
        suitable: boolean;
        reason: string;
        score: number;
    };
    cropAdvice: string;
    source: 'live' | 'fallback';
}

// Realistic fallback data for major Indian cities
const cityFallbacks: Record<string, Partial<WeatherResult>> = {
    delhi: { temperature: 32, humidity: 55, windSpeed: 14, precipitation: 0, description: 'Sunny and dry' },
    mumbai: { temperature: 30, humidity: 80, windSpeed: 18, precipitation: 2, description: 'Humid and partly cloudy' },
    bangalore: { temperature: 24, humidity: 65, windSpeed: 10, precipitation: 1, description: 'Pleasant and mild' },
    chennai: { temperature: 34, humidity: 75, windSpeed: 16, precipitation: 0, description: 'Hot and humid' },
    kolkata: { temperature: 31, humidity: 70, windSpeed: 12, precipitation: 3, description: 'Warm and cloudy' },
    hyderabad: { temperature: 29, humidity: 60, windSpeed: 11, precipitation: 0, description: 'Warm and partly cloudy' },
    pune: { temperature: 26, humidity: 60, windSpeed: 13, precipitation: 0, description: 'Mild and pleasant' },
    jaipur: { temperature: 33, humidity: 40, windSpeed: 15, precipitation: 0, description: 'Hot and arid' },
    lucknow: { temperature: 31, humidity: 58, windSpeed: 12, precipitation: 0, description: 'Warm and partly cloudy' },
    chandigarh: { temperature: 27, humidity: 52, windSpeed: 11, precipitation: 0, description: 'Warm and breezy' },
    amritsar: { temperature: 28, humidity: 50, windSpeed: 13, precipitation: 0, description: 'Warm and clear' },
    bhopal: { temperature: 30, humidity: 55, windSpeed: 12, precipitation: 0, description: 'Warm and partly cloudy' },
    patna: { temperature: 33, humidity: 65, windSpeed: 10, precipitation: 1, description: 'Hot and humid' },
    nagpur: { temperature: 35, humidity: 45, windSpeed: 13, precipitation: 0, description: 'Very hot and dry' },
};

function getFarmingSuitability(temp: number, humidity: number, windSpeed: number): { suitable: boolean; reason: string; score: number } {
    let score = 100;
    const issues: string[] = [];

    if (temp < 5) { score -= 40; issues.push('Temperature too cold for most crops'); }
    else if (temp < 10) { score -= 20; issues.push('Low temperature limits crop options'); }
    else if (temp > 42) { score -= 40; issues.push('Extreme heat stresses crops'); }
    else if (temp > 35) { score -= 15; issues.push('High temperature — irrigate regularly'); }

    if (humidity < 20) { score -= 20; issues.push('Very low humidity — crops may dry out'); }
    else if (humidity > 90) { score -= 15; issues.push('Very high humidity increases disease risk'); }

    if (windSpeed > 40) { score -= 20; issues.push('Strong winds may damage standing crops'); }

    score = Math.max(0, score);
    const suitable = score >= 55;
    const reason = issues.length > 0 ? issues.join('; ') : 'Conditions are favorable for farming';
    return { suitable, reason, score };
}

function getCropAdvice(temp: number, humidity: number, precipitation: number): string {
    if (temp >= 20 && temp <= 30 && humidity >= 60) return 'Ideal for rice, sugarcane, and jute.';
    if (temp >= 10 && temp <= 25 && humidity < 60) return 'Good season for wheat, mustard, and barley.';
    if (temp >= 25 && temp <= 35 && humidity < 50) return 'Suitable for cotton, sorghum, and pearl millet.';
    if (temp >= 15 && temp <= 30 && precipitation > 5) return 'Excellent for maize, pulses, and vegetables.';
    if (temp > 35) return 'Grow heat-tolerant crops like groundnut and sesame.';
    return 'Moderate conditions — consider local seasonal crop calendar.';
}

export const fetchWeatherData = async (city: string): Promise<WeatherResult> => {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (apiKey && apiKey !== 'your_openweathermap_api_key_here') {
        try {
            const response = await axios.get(
                `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
                { timeout: 5000 }
            );
            const d = response.data;
            const temp = d.main.temp;
            const humidity = d.main.humidity;
            const windSpeed = d.wind.speed * 3.6; // m/s → km/h
            const precipitation = d.rain?.['1h'] ?? d.rain?.['3h'] ?? 0;
            const suitability = getFarmingSuitability(temp, humidity, windSpeed);

            return {
                location: `${d.name}, ${d.sys.country}`,
                temperature: Math.round(temp * 10) / 10,
                feelsLike: Math.round(d.main.feels_like * 10) / 10,
                humidity,
                windSpeed: Math.round(windSpeed),
                precipitation,
                description: d.weather[0]?.description ?? '',
                icon: d.weather[0]?.icon ?? '',
                pressure: d.main.pressure,
                visibility: Math.round((d.visibility ?? 10000) / 1000),
                farmingSuitability: suitability,
                cropAdvice: getCropAdvice(temp, humidity, precipitation),
                source: 'live',
            };
        } catch {
            // Fall through to fallback
        }
    }

    // Fallback: use realistic city data or generic defaults
    const key = city.toLowerCase().replace(/\s+/g, '');
    const fb = cityFallbacks[key] ?? { temperature: 28, humidity: 62, windSpeed: 12, precipitation: 1, description: 'Partly cloudy' };
    const temp = fb.temperature ?? 28;
    const humidity = fb.humidity ?? 62;
    const windSpeed = fb.windSpeed ?? 12;
    const precipitation = fb.precipitation ?? 1;
    const suitability = getFarmingSuitability(temp, humidity, windSpeed);

    return {
        location: city.charAt(0).toUpperCase() + city.slice(1),
        temperature: temp,
        feelsLike: temp - 2,
        humidity,
        windSpeed,
        precipitation,
        description: fb.description ?? 'Partly cloudy',
        icon: '02d',
        pressure: 1013,
        visibility: 10,
        farmingSuitability: suitability,
        cropAdvice: getCropAdvice(temp, humidity, precipitation),
        source: 'fallback',
    };
};

// WMO Weather Interpretation Code → description mapping (subset)
function wmoDescription(code: number): string {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code <= 9) return 'Foggy';
    if (code <= 19) return 'Drizzle';
    if (code <= 29) return 'Rain showers';
    if (code <= 39) return 'Snow';
    if (code <= 49) return 'Fog';
    if (code <= 59) return 'Drizzle';
    if (code <= 69) return 'Rain';
    if (code <= 79) return 'Snow';
    if (code <= 84) return 'Rain showers';
    if (code <= 94) return 'Thunderstorm';
    return 'Thunderstorm with hail';
}

/**
 * Fetches current weather for a lat/lon coordinate using the free Open-Meteo API.
 * No API key required.
 */
export const fetchWeatherByLatLon = async (lat: number, lon: number): Promise<WeatherResult> => {
    try {
        const [meteoResp, geoResp] = await Promise.allSettled([
            axios.get(OPEN_METEO_BASE, {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current_weather: true,
                    hourly: 'relativehumidity_2m,precipitation,apparent_temperature,surface_pressure,visibility',
                    forecast_days: 1,
                    timezone: 'auto',
                },
                timeout: 8000,
            }),
            axios.get(GEOCODING_URL, {
                params: { lat, lon, format: 'json' },
                headers: { 'User-Agent': 'KrishiAI/2.0' },
                timeout: 5000,
            }),
        ]);

        if (meteoResp.status !== 'fulfilled') {
            throw new Error('Open-Meteo request failed');
        }

        const m = meteoResp.value.data;
        const cw = m.current_weather;
        const temp: number = cw.temperature;
        const windSpeed: number = Math.round(cw.windspeed);

        // Use the first hourly value as a proxy for "current" conditions
        const hourly = m.hourly ?? {};
        const humidity: number = (hourly.relativehumidity_2m?.[0]) ?? 60;
        const precipitation: number = (hourly.precipitation?.[0]) ?? 0;
        const feelsLike: number = hourly.apparent_temperature?.[0] ?? (temp - 2);
        const pressure: number = hourly.surface_pressure?.[0] ?? 1013;
        const visibilityRaw: number = hourly.visibility?.[0] ?? 10000;

        const description = wmoDescription(cw.weathercode ?? 0);
        const suitability = getFarmingSuitability(temp, humidity, windSpeed);

        let locationName = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        if (geoResp.status === 'fulfilled') {
            const addr = geoResp.value.data?.address;
            if (addr) {
                const parts = [addr.village ?? addr.town ?? addr.city ?? addr.county, addr.state, addr.country]
                    .filter(Boolean);
                if (parts.length > 0) locationName = parts.join(', ');
            }
        }

        return {
            location: locationName,
            temperature: Math.round(temp * 10) / 10,
            feelsLike: Math.round(feelsLike * 10) / 10,
            humidity,
            windSpeed,
            precipitation,
            description,
            icon: cw.is_day ? '01d' : '01n',
            pressure,
            visibility: Math.round(visibilityRaw / 1000),
            farmingSuitability: suitability,
            cropAdvice: getCropAdvice(temp, humidity, precipitation),
            source: 'live',
        };
    } catch {
        // Return a generic fallback when coordinates can't be resolved
        const temp = 28;
        const humidity = 62;
        const windSpeed = 12;
        const precipitation = 1;
        const suitability = getFarmingSuitability(temp, humidity, windSpeed);
        return {
            location: `${lat.toFixed(2)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`,
            temperature: temp,
            feelsLike: temp - 2,
            humidity,
            windSpeed,
            precipitation,
            description: 'Partly cloudy',
            icon: '02d',
            pressure: 1013,
            visibility: 10,
            farmingSuitability: suitability,
            cropAdvice: getCropAdvice(temp, humidity, precipitation),
            source: 'fallback',
        };
    }
};
