// cropRecommendationService.ts
// Evidence-based crop recommendation engine for Indian agriculture

export interface CropProfile {
    name: string;
    hindiName: string;
    season: string;
    pHRange: [number, number];
    temperatureRange: [number, number]; // Celsius
    rainfallRange: [number, number]; // mm/season
    humidityRange: [number, number]; // %
    nitrogenNeed: 'Low' | 'Medium' | 'High';
    soilTypes: string[];
    waterRequirement: 'Low' | 'Medium' | 'High';
    durationDays: number;
    avgYieldTonsPerAcre: number;
    avgPricePerQuintal: number; // INR
    description: string;
    regions: string[];
}

export const cropProfiles: CropProfile[] = [
    {
        name: 'Wheat', hindiName: 'गेहूं', season: 'Rabi (Oct–Mar)',
        pHRange: [6.0, 7.5], temperatureRange: [10, 25], rainfallRange: [450, 900],
        humidityRange: [40, 70], nitrogenNeed: 'Medium', soilTypes: ['Loamy', 'Clay loam'],
        waterRequirement: 'Medium', durationDays: 120, avgYieldTonsPerAcre: 2.5,
        avgPricePerQuintal: 2150, description: 'Staple crop grown in Rabi season. Thrives in cool, dry weather.',
        regions: ['Punjab', 'Haryana', 'UP', 'Madhya Pradesh', 'Rajasthan'],
    },
    {
        name: 'Rice', hindiName: 'धान', season: 'Kharif (Jun–Nov)',
        pHRange: [5.5, 7.0], temperatureRange: [20, 37], rainfallRange: [1000, 2000],
        humidityRange: [70, 90], nitrogenNeed: 'High', soilTypes: ['Clay', 'Clay loam', 'Alluvial'],
        waterRequirement: 'High', durationDays: 120, avgYieldTonsPerAcre: 2.0,
        avgPricePerQuintal: 2183, description: 'Kharif season paddy. Needs abundant water and warm climate.',
        regions: ['West Bengal', 'Punjab', 'Andhra Pradesh', 'Tamil Nadu', 'Odisha'],
    },
    {
        name: 'Maize', hindiName: 'मक्का', season: 'Kharif (Jun–Sep)',
        pHRange: [5.5, 7.5], temperatureRange: [18, 35], rainfallRange: [500, 900],
        humidityRange: [50, 80], nitrogenNeed: 'High', soilTypes: ['Sandy loam', 'Loamy'],
        waterRequirement: 'Medium', durationDays: 90, avgYieldTonsPerAcre: 2.2,
        avgPricePerQuintal: 1800, description: 'Versatile crop used for food, feed and starch. Grows well in well-drained soils.',
        regions: ['Karnataka', 'Rajasthan', 'MP', 'Bihar', 'Himachal Pradesh'],
    },
    {
        name: 'Cotton', hindiName: 'कपास', season: 'Kharif (May–Nov)',
        pHRange: [5.8, 8.0], temperatureRange: [20, 35], rainfallRange: [500, 700],
        humidityRange: [40, 65], nitrogenNeed: 'Medium', soilTypes: ['Black cotton soil', 'Sandy loam'],
        waterRequirement: 'Medium', durationDays: 180, avgYieldTonsPerAcre: 1.2,
        avgPricePerQuintal: 6000, description: 'Cash crop needing warm weather and moderate rainfall. Long growing season.',
        regions: ['Gujarat', 'Maharashtra', 'Telangana', 'Punjab', 'Madhya Pradesh'],
    },
    {
        name: 'Sugarcane', hindiName: 'गन्ना', season: 'Year-round (12–18 months)',
        pHRange: [6.0, 8.0], temperatureRange: [20, 35], rainfallRange: [1000, 1800],
        humidityRange: [60, 85], nitrogenNeed: 'High', soilTypes: ['Loamy', 'Sandy loam', 'Alluvial'],
        waterRequirement: 'High', durationDays: 360, avgYieldTonsPerAcre: 35,
        avgPricePerQuintal: 315, description: 'Long-duration cash crop. Requires warm climate with adequate water.',
        regions: ['UP', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh'],
    },
    {
        name: 'Chickpea', hindiName: 'चना', season: 'Rabi (Oct–Mar)',
        pHRange: [6.0, 8.0], temperatureRange: [10, 30], rainfallRange: [300, 700],
        humidityRange: [30, 60], nitrogenNeed: 'Low', soilTypes: ['Sandy loam', 'Loamy', 'Clay loam'],
        waterRequirement: 'Low', durationDays: 100, avgYieldTonsPerAcre: 0.8,
        avgPricePerQuintal: 5100, description: 'Drought-tolerant pulse. Fixes atmospheric nitrogen. Ideal for dryland farming.',
        regions: ['Madhya Pradesh', 'Rajasthan', 'Maharashtra', 'Uttar Pradesh'],
    },
    {
        name: 'Mustard', hindiName: 'सरसों', season: 'Rabi (Oct–Feb)',
        pHRange: [6.0, 7.5], temperatureRange: [10, 25], rainfallRange: [300, 500],
        humidityRange: [35, 65], nitrogenNeed: 'Medium', soilTypes: ['Sandy loam', 'Loamy'],
        waterRequirement: 'Low', durationDays: 110, avgYieldTonsPerAcre: 0.6,
        avgPricePerQuintal: 5200, description: 'Oilseed crop thriving in dry Rabi conditions. Quick-maturing.',
        regions: ['Rajasthan', 'Haryana', 'UP', 'Madhya Pradesh', 'West Bengal'],
    },
    {
        name: 'Soybean', hindiName: 'सोयाबीन', season: 'Kharif (Jun–Oct)',
        pHRange: [6.0, 7.5], temperatureRange: [20, 32], rainfallRange: [600, 1000],
        humidityRange: [55, 80], nitrogenNeed: 'Low', soilTypes: ['Loamy', 'Clay loam', 'Black soil'],
        waterRequirement: 'Medium', durationDays: 100, avgYieldTonsPerAcre: 1.0,
        avgPricePerQuintal: 4000, description: 'Oilseed-cum-pulse with high protein. Nitrogen-fixing legume.',
        regions: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka'],
    },
    {
        name: 'Tomato', hindiName: 'टमाटर', season: 'Rabi/Summer (Oct–Mar)',
        pHRange: [6.0, 7.0], temperatureRange: [15, 30], rainfallRange: [400, 800],
        humidityRange: [40, 70], nitrogenNeed: 'High', soilTypes: ['Sandy loam', 'Loamy'],
        waterRequirement: 'Medium', durationDays: 75, avgYieldTonsPerAcre: 8,
        avgPricePerQuintal: 1500, description: 'High-value vegetable crop. Short cycle with good returns.',
        regions: ['Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'UP'],
    },
    {
        name: 'Groundnut', hindiName: 'मूंगफली', season: 'Kharif (Jun–Oct)',
        pHRange: [5.5, 7.0], temperatureRange: [25, 35], rainfallRange: [500, 800],
        humidityRange: [50, 75], nitrogenNeed: 'Low', soilTypes: ['Sandy loam', 'Sandy'],
        waterRequirement: 'Low', durationDays: 130, avgYieldTonsPerAcre: 1.2,
        avgPricePerQuintal: 5500, description: 'Oilseed crop suited for light soils and warm weather.',
        regions: ['Gujarat', 'Rajasthan', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka'],
    },
    {
        name: 'Turmeric', hindiName: 'हल्दी', season: 'Kharif (Apr–Jan)',
        pHRange: [5.5, 7.5], temperatureRange: [20, 35], rainfallRange: [1200, 2000],
        humidityRange: [65, 85], nitrogenNeed: 'Medium', soilTypes: ['Loamy', 'Sandy loam', 'Clay loam'],
        waterRequirement: 'High', durationDays: 270, avgYieldTonsPerAcre: 2.5,
        avgPricePerQuintal: 7000, description: 'Spice crop with high export value. Needs warm humid conditions.',
        regions: ['Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Maharashtra', 'Odisha'],
    },
    {
        name: 'Onion', hindiName: 'प्याज', season: 'Rabi/Kharif',
        pHRange: [6.0, 7.5], temperatureRange: [13, 28], rainfallRange: [350, 650],
        humidityRange: [40, 65], nitrogenNeed: 'Medium', soilTypes: ['Sandy loam', 'Loamy'],
        waterRequirement: 'Medium', durationDays: 120, avgYieldTonsPerAcre: 6,
        avgPricePerQuintal: 1200, description: 'High-demand vegetable. Good market returns and manageable water needs.',
        regions: ['Maharashtra', 'Karnataka', 'Madhya Pradesh', 'Bihar', 'Andhra Pradesh'],
    },
];

export interface CropRecommendationInput {
    temperature: number;   // °C
    rainfall: number;      // mm/season
    phLevel: number;       // 4–9
    humidity?: number;     // % (optional)
    soilType?: string;     // optional
    nitrogen?: number;     // ppm (optional)
}

export interface CropRecommendationResult {
    name: string;
    hindiName: string;
    suitability: number; // 0–100
    season: string;
    reason: string;
    avgPrice: number;
    durationDays: number;
    waterRequirement: string;
}

export function recommendCrops(input: CropRecommendationInput): CropRecommendationResult[] {
    const results: CropRecommendationResult[] = [];

    for (const crop of cropProfiles) {
        let score = 0;
        const reasons: string[] = [];

        // Temperature scoring (35 pts)
        const [tMin, tMax] = crop.temperatureRange;
        const tMid = (tMin + tMax) / 2;
        if (input.temperature >= tMin && input.temperature <= tMax) {
            const closeness = 1 - Math.abs(input.temperature - tMid) / ((tMax - tMin) / 2);
            score += 35 * (0.6 + 0.4 * closeness);
            reasons.push(`Temperature ${input.temperature}°C is within optimal range`);
        } else {
            const dist = Math.min(Math.abs(input.temperature - tMin), Math.abs(input.temperature - tMax));
            if (dist <= 5) { score += 15; reasons.push(`Temperature slightly outside optimal range`); }
        }

        // Rainfall scoring (30 pts)
        const [rMin, rMax] = crop.rainfallRange;
        if (input.rainfall >= rMin && input.rainfall <= rMax) {
            const rMid = (rMin + rMax) / 2;
            const closeness = 1 - Math.abs(input.rainfall - rMid) / ((rMax - rMin) / 2);
            score += 30 * (0.6 + 0.4 * closeness);
            reasons.push(`Rainfall ${input.rainfall}mm matches crop needs`);
        } else {
            const dist = Math.min(Math.abs(input.rainfall - rMin), Math.abs(input.rainfall - rMax));
            if (dist <= 100) { score += 10; reasons.push(`Rainfall slightly outside optimal range`); }
        }

        // pH scoring (20 pts)
        const [pMin, pMax] = crop.pHRange;
        if (input.phLevel >= pMin && input.phLevel <= pMax) {
            score += 20;
            reasons.push(`Soil pH ${input.phLevel} is suitable`);
        } else {
            const dist = Math.min(Math.abs(input.phLevel - pMin), Math.abs(input.phLevel - pMax));
            if (dist <= 0.5) { score += 8; reasons.push(`Soil pH borderline`); }
        }

        // Humidity scoring (15 pts, if provided)
        if (input.humidity !== undefined) {
            const [hMin, hMax] = crop.humidityRange;
            if (input.humidity >= hMin && input.humidity <= hMax) {
                score += 15;
                reasons.push(`Humidity ${input.humidity}% is favorable`);
            } else {
                const dist = Math.min(Math.abs(input.humidity - hMin), Math.abs(input.humidity - hMax));
                if (dist <= 10) { score += 5; }
            }
        } else {
            score += 8; // neutral when not provided
        }

        // Normalize to 0–100
        const maxPossible = 100;
        const normalizedScore = Math.min(100, Math.round((score / maxPossible) * 100));

        if (normalizedScore >= 30) {
            results.push({
                name: crop.name,
                hindiName: crop.hindiName,
                suitability: normalizedScore,
                season: crop.season,
                reason: reasons.slice(0, 2).join('. ') || 'Partially suitable for given conditions',
                avgPrice: crop.avgPricePerQuintal,
                durationDays: crop.durationDays,
                waterRequirement: crop.waterRequirement,
            });
        }
    }

    // Sort by suitability descending and return top 5
    return results
        .sort((a, b) => b.suitability - a.suitability)
        .slice(0, 5);
}

export default recommendCrops;