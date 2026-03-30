// fertilizerAgent.ts — Fertilizer recommendation agent (uses fertilizerService for full implementation)

import { recommendFertilizer } from '../services/fertilizerService';

export function getFertilizerRecommendation(
    nutrients: { nitrogen: number; phosphorus: number; potassium: number },
    cropType: string
) {
    return recommendFertilizer({
        cropType,
        nitrogen: nutrients.nitrogen,
        phosphorus: nutrients.phosphorus,
        potassium: nutrients.potassium,
    });
}

export default { getFertilizerRecommendation };
