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
    knnDistance?: number;    // Euclidean distance in feature space (lower = closer match)
    seasonalScore?: number;  // Seasonal fit bonus (0–1)
}

// ── Feature normalisation helpers ─────────────────────────────────────────────

/** Normalise a value to [0, 1] given the observed global range across all crops. */
const FEATURE_RANGES = {
    temperature: { min: 10, max: 37 },
    rainfall:    { min: 300, max: 2000 },
    phLevel:     { min: 5.5, max: 8.0 },
    humidity:    { min: 30, max: 90 },
};

function normalise(value: number, key: keyof typeof FEATURE_RANGES): number {
    const { min, max } = FEATURE_RANGES[key];
    return (value - min) / (max - min);
}

/**
 * Fuzzy distance between a point and a [min, max] range.
 * Returns 0 when inside the range, increasing as the point moves outside.
 */
function fuzzyRangeDistance(value: number, min: number, max: number, scale: number): number {
    if (value >= min && value <= max) return 0;
    const dist = Math.min(Math.abs(value - min), Math.abs(value - max));
    return dist / scale;
}

// ── Seasonal adjustment ────────────────────────────────────────────────────────
/** Return a seasonal bonus in [0, 1] for a crop given the current month (0-indexed). */
function seasonalScore(crop: CropProfile): number {
    const month = new Date().getMonth(); // 0=Jan, …, 11=Dec
    const kharifMonths  = new Set([5, 6, 7, 8, 9]);          // Jun–Oct
    const rabiMonths    = new Set([9, 10, 11, 0, 1, 2]);      // Oct–Mar
    const summerMonths  = new Set([2, 3, 4, 5]);              // Mar–Jun
    const yearRoundStr  = 'year-round';

    const s = crop.season.toLowerCase();
    if (s.includes(yearRoundStr)) return 0.9;
    if (s.includes('kharif') && kharifMonths.has(month)) return 1.0;
    if (s.includes('rabi')   && rabiMonths.has(month))   return 1.0;
    if (s.includes('summer') && summerMonths.has(month)) return 1.0;
    if (s.includes('kharif') && !kharifMonths.has(month)) return 0.4;
    if (s.includes('rabi')   && !rabiMonths.has(month))   return 0.4;
    return 0.7;
}

// ── KNN recommendation ────────────────────────────────────────────────────────
export function recommendCrops(input: CropRecommendationInput): CropRecommendationResult[] {
    const results: Array<CropRecommendationResult & { _rawScore: number }> = [];

    // Normalise input features once
    const normTemp     = normalise(input.temperature, 'temperature');
    const normRain     = normalise(input.rainfall,    'rainfall');
    const normPH       = normalise(input.phLevel,     'phLevel');
    const normHumidity = input.humidity !== undefined ? normalise(input.humidity, 'humidity') : null;

    for (const crop of cropProfiles) {
        const reasons: string[] = [];

        // ── KNN: weighted Euclidean distance in normalised feature space ──────
        const [tMin, tMax] = crop.temperatureRange;
        const [rMin, rMax] = crop.rainfallRange;
        const [pMin, pMax] = crop.pHRange;
        const [hMin, hMax] = crop.humidityRange;

        // Crop midpoints (normalised)
        const cropNormTemp = normalise((tMin + tMax) / 2, 'temperature');
        const cropNormRain = normalise((rMin + rMax) / 2, 'rainfall');
        const cropNormPH   = normalise((pMin + pMax) / 2, 'phLevel');
        const cropNormHum  = normalise((hMin + hMax) / 2, 'humidity');

        // Feature weights: temperature and rainfall dominate
        const W_TEMP = 0.35, W_RAIN = 0.30, W_PH = 0.20, W_HUM = 0.15;

        const dTemp = fuzzyRangeDistance(input.temperature, tMin, tMax, FEATURE_RANGES.temperature.max - FEATURE_RANGES.temperature.min);
        const dRain = fuzzyRangeDistance(input.rainfall,    rMin, rMax, FEATURE_RANGES.rainfall.max    - FEATURE_RANGES.rainfall.min);
        const dPH   = fuzzyRangeDistance(input.phLevel,     pMin, pMax, FEATURE_RANGES.phLevel.max     - FEATURE_RANGES.phLevel.min);
        const dHum  = normHumidity !== null
            ? fuzzyRangeDistance(input.humidity!, hMin, hMax, FEATURE_RANGES.humidity.max - FEATURE_RANGES.humidity.min)
            : Math.abs(normHumidity !== null ? normHumidity - cropNormHum : 0);

        // Also factor point-to-midpoint distance (adds smoothness)
        const midDistTemp = Math.abs(normTemp - cropNormTemp);
        const midDistRain = Math.abs(normRain - cropNormRain);
        const midDistPH   = Math.abs(normPH   - cropNormPH);
        const midDistHum  = normHumidity !== null ? Math.abs(normHumidity - cropNormHum) : 0;

        const knnDist = Math.sqrt(
            W_TEMP * Math.pow((dTemp + midDistTemp) / 2, 2) +
            W_RAIN * Math.pow((dRain + midDistRain) / 2, 2) +
            W_PH   * Math.pow((dPH   + midDistPH)   / 2, 2) +
            W_HUM  * Math.pow((dHum  + midDistHum)   / 2, 2)
        );

        // ── Reason strings ────────────────────────────────────────────────────
        if (dTemp === 0) reasons.push(`Temperature ${input.temperature}°C is within optimal range`);
        else reasons.push(`Temperature slightly outside optimal range`);
        if (dRain === 0) reasons.push(`Rainfall ${input.rainfall}mm matches crop needs`);
        if (dPH   === 0) reasons.push(`Soil pH ${input.phLevel} is suitable`);
        if (normHumidity !== null && dHum === 0) reasons.push(`Humidity ${input.humidity}% is favorable`);

        // ── Soil type bonus ───────────────────────────────────────────────────
        let soilBonus = 0;
        if (input.soilType) {
            const matchesSoil = crop.soilTypes.some(
                s => s.toLowerCase().includes(input.soilType!.toLowerCase()) ||
                     input.soilType!.toLowerCase().includes(s.toLowerCase())
            );
            if (matchesSoil) { soilBonus = 0.05; reasons.push(`Soil type matches`); }
        }

        // ── Seasonal fit ──────────────────────────────────────────────────────
        const seasonal = seasonalScore(crop);

        // ── Convert KNN distance to a 0–100 suitability score ─────────────────
        // Distance 0 → 100, distance 0.5 → ~50, distance ≥ 1 → ~0
        const baseScore = Math.max(0, 100 * (1 - knnDist * 1.8));
        const adjustedScore = Math.round(Math.min(100, baseScore * seasonal + soilBonus * 100));

        if (adjustedScore >= 25) {
            results.push({
                name: crop.name,
                hindiName: crop.hindiName,
                suitability: adjustedScore,
                season: crop.season,
                reason: reasons.slice(0, 3).join('. ') || 'Partially suitable for given conditions',
                avgPrice: crop.avgPricePerQuintal,
                durationDays: crop.durationDays,
                waterRequirement: crop.waterRequirement,
                knnDistance: Math.round(knnDist * 1000) / 1000,
                seasonalScore: Math.round(seasonal * 100) / 100,
                _rawScore: adjustedScore,
            });
        }
    }

    // Sort by suitability descending and return top 5
    return results
        .sort((a, b) => b._rawScore - a._rawScore)
        .slice(0, 5)
        .map(({ _rawScore: _r, ...rest }) => rest);
}

export default recommendCrops;