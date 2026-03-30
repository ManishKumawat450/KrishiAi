import axios from 'axios';

const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';

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
