// cropAgent.ts

// Import necessary libraries
import { WeatherData, SoilData } from './dataModels';

/**
 * Crop Recommendation AI Agent
 */
class CropAgent {
    private weatherData: WeatherData;
    private soilData: SoilData;

    constructor(weather: WeatherData, soil: SoilData) {
        this.weatherData = weather;
        this.soilData = soil;
    }

    /**
     * Recommend suitable crops based on weather and soil data
     */
    recommendCrops(): string[] {
        const recommendations: string[] = [];

        if (this.weatherData.temperature > 20 && this.soilData.moisture > 15) {
            recommendations.push('Rice');
        }
        if (this.weatherData.temperature < 20 && this.soilData.pH < 6.5) {
            recommendations.push('Wheat');
        }
        if (this.weatherData.sunlightHours > 5 && this.soilData.nitrogen > 0.5) {
            recommendations.push('Corn');
        }

        return recommendations;
    }
}

export default CropAgent;
