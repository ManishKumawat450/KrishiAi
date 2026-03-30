// cropAgent.ts — legacy agent (logic moved to cropRecommendationService)

import { WeatherData, SoilData } from '../types/dataModels';

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

        if (this.weatherData.temperature > 20 && this.soilData.moistureContent > 15) {
            recommendations.push('Rice');
        }
        if (this.weatherData.temperature < 20 && this.soilData.phLevel < 6.5) {
            recommendations.push('Wheat');
        }
        if (this.soilData.nutrientLevels.nitrogen > 50) {
            recommendations.push('Corn');
        }

        return recommendations;
    }
}

export default CropAgent;
