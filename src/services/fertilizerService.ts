// fertilizerService.ts
// Evidence-based fertilizer recommendation system for Indian crops

export interface FertilizerProfile {
    name: string;
    hindiName: string;
    nutrient: 'N' | 'P' | 'K' | 'NPK' | 'Micro';
    npkRatio: string;
    costPerBag: number; // INR per 50kg bag
    bagWeightKg: number;
    applicationMethod: string;
    suitableCrops: string[];
    benefits: string;
}

export const fertilizerProfiles: FertilizerProfile[] = [
    { name: 'Urea', hindiName: 'यूरिया', nutrient: 'N', npkRatio: '46-0-0', costPerBag: 270, bagWeightKg: 50, applicationMethod: 'Broadcast or band placement', suitableCrops: ['All crops'], benefits: 'Quick nitrogen release for vegetative growth' },
    { name: 'DAP', hindiName: 'डीएपी', nutrient: 'NPK', npkRatio: '18-46-0', costPerBag: 1350, bagWeightKg: 50, applicationMethod: 'Basal application before sowing', suitableCrops: ['Wheat', 'Rice', 'Maize', 'Oilseeds', 'Pulses'], benefits: 'Excellent phosphorus source for root development' },
    { name: 'MOP (Muriate of Potash)', hindiName: 'पोटाश', nutrient: 'K', npkRatio: '0-0-60', costPerBag: 1100, bagWeightKg: 50, applicationMethod: 'Basal or split application', suitableCrops: ['All crops'], benefits: 'Improves crop quality and disease resistance' },
    { name: 'SSP (Single Super Phosphate)', hindiName: 'सिंगल सुपर फॉस्फेट', nutrient: 'P', npkRatio: '0-16-0', costPerBag: 450, bagWeightKg: 50, applicationMethod: 'Basal application', suitableCrops: ['Wheat', 'Cotton', 'Sugarcane', 'Vegetables'], benefits: 'Also provides calcium and sulfur' },
    { name: 'NPK 12-32-16', hindiName: 'एनपीके मिश्रण', nutrient: 'NPK', npkRatio: '12-32-16', costPerBag: 1400, bagWeightKg: 50, applicationMethod: 'Basal application before sowing', suitableCrops: ['Cotton', 'Groundnut', 'Soybean', 'Vegetables'], benefits: 'Balanced nutrition for overall crop growth' },
    { name: 'Ammonium Sulphate', hindiName: 'अमोनियम सल्फेट', nutrient: 'N', npkRatio: '21-0-0', costPerBag: 800, bagWeightKg: 50, applicationMethod: 'Top dressing', suitableCrops: ['Rice', 'Wheat', 'Sugarcane'], benefits: 'Nitrogen + Sulfur; ideal for alkaline soils' },
    { name: 'Zinc Sulphate', hindiName: 'जिंक सल्फेट', nutrient: 'Micro', npkRatio: '0-0-0 + Zn 21%', costPerBag: 1200, bagWeightKg: 25, applicationMethod: 'Soil application or foliar spray', suitableCrops: ['Rice', 'Wheat', 'Maize', 'Citrus'], benefits: 'Corrects zinc deficiency common in Indian soils' },
    { name: 'Vermicompost', hindiName: 'वर्मीकम्पोस्ट', nutrient: 'NPK', npkRatio: '1.5-1.0-1.5', costPerBag: 200, bagWeightKg: 50, applicationMethod: 'Soil incorporation before sowing', suitableCrops: ['All crops'], benefits: 'Improves soil health, water retention and microbial activity' },
];

export interface FertilizerInput {
    cropType: string;
    nitrogen: number;      // Soil N in ppm/kg
    phosphorus: number;    // Soil P in ppm/kg
    potassium: number;     // Soil K in ppm/kg
    areaInAcres?: number;  // Default 1 acre
    soilType?: string;
}

export interface FertilizerRecommendationItem {
    name: string;
    hindiName: string;
    quantity: number;   // kg per acre
    unit: string;
    timing: string;
    cost: number;       // INR per acre
    reason: string;
    applicationMethod: string;
}

export interface FertilizerResult {
    crop: string;
    fertilizers: FertilizerRecommendationItem[];
    totalCostPerAcre: number;
    totalCost: number;
    areaInAcres: number;
    soilHealthAdvice: string;
    organicAlternative: string;
    applicationSchedule: string;
}

// Crop-specific NPK requirements (kg per acre)
interface CropNPKRequirement {
    N: number; P: number; K: number;
    notes: string;
}

const cropNPKRequirements: Record<string, CropNPKRequirement> = {
    wheat:     { N: 60, P: 30, K: 30, notes: 'Apply half N as basal, half at first irrigation' },
    rice:      { N: 50, P: 25, K: 25, notes: 'Split N in 3 doses: basal, tillering, panicle initiation' },
    maize:     { N: 70, P: 35, K: 30, notes: 'Apply N in 3 splits for best results' },
    cotton:    { N: 50, P: 25, K: 50, notes: 'High K requirement for fiber quality' },
    sugarcane: { N: 100, P: 40, K: 60, notes: 'Spread N application over 4–6 splits' },
    chickpea:  { N: 20, P: 30, K: 20, notes: 'Nitrogen-fixing; apply only starter N' },
    mustard:   { N: 40, P: 20, K: 20, notes: 'Add sulfur for better oil content' },
    soybean:   { N: 25, P: 30, K: 30, notes: 'Nitrogen-fixing legume; moderate N needed' },
    tomato:    { N: 60, P: 40, K: 50, notes: 'High K for fruit quality and shelf life' },
    groundnut: { N: 25, P: 30, K: 20, notes: 'Needs calcium; apply gypsum @ 100kg/acre' },
    onion:     { N: 50, P: 25, K: 50, notes: 'High K for bulb development' },
};

// Thresholds for soil nutrient sufficiency (ppm)
const sufficiencyLevels = {
    N: { low: 25, medium: 50, high: 100 },
    P: { low: 10, medium: 20, high: 40 },
    K: { low: 50, medium: 100, high: 200 },
};

function getNutrientDeficiency(value: number, levels: { low: number; medium: number; high: number }): 'Very Low' | 'Low' | 'Adequate' | 'High' {
    if (value < levels.low) return 'Very Low';
    if (value < levels.medium) return 'Low';
    if (value < levels.high) return 'Adequate';
    return 'High';
}

export function recommendFertilizer(input: FertilizerInput): FertilizerResult {
    const area = input.areaInAcres ?? 1;
    const cropKey = input.cropType.toLowerCase();
    const requirements = cropNPKRequirements[cropKey] ?? { N: 50, P: 25, K: 25, notes: 'Standard crop nutrition program' };

    const nStatus = getNutrientDeficiency(input.nitrogen, sufficiencyLevels.N);
    const pStatus = getNutrientDeficiency(input.phosphorus, sufficiencyLevels.P);
    const kStatus = getNutrientDeficiency(input.potassium, sufficiencyLevels.K);

    // Calculate additional nutrients needed
    const existingN = Math.min(input.nitrogen * 0.5, requirements.N); // available fraction
    const existingP = Math.min(input.phosphorus * 0.3, requirements.P);
    const existingK = Math.min(input.potassium * 0.2, requirements.K);

    const neededN = Math.max(0, requirements.N - existingN);
    const neededP = Math.max(0, requirements.P - existingP);
    const neededK = Math.max(0, requirements.K - existingK);

    const fertilizers: FertilizerRecommendationItem[] = [];

    // Nitrogen recommendation
    if (neededN > 5) {
        const ureaKgAcre = Math.round((neededN / 0.46) * 10) / 10; // Urea is 46% N
        fertilizers.push({
            name: 'Urea', hindiName: 'यूरिया',
            quantity: ureaKgAcre,
            unit: 'kg/acre',
            timing: nStatus === 'Very Low' ? 'Basal 50% + Top dress 50% at 30 days' : 'Top dressing at 30–45 days',
            cost: Math.round((ureaKgAcre / 50) * 270),
            reason: `Soil nitrogen is ${nStatus} (${input.nitrogen} ppm); crop needs ${requirements.N} kg N/acre`,
            applicationMethod: 'Broadcast evenly and irrigate immediately',
        });
    }

    // Phosphorus recommendation using DAP
    if (neededP > 3) {
        const dapKgAcre = Math.round((neededP / 0.46) * 10) / 10; // DAP is 46% P2O5
        fertilizers.push({
            name: 'DAP', hindiName: 'डीएपी',
            quantity: dapKgAcre,
            unit: 'kg/acre',
            timing: 'Basal application before or at sowing',
            cost: Math.round((dapKgAcre / 50) * 1350),
            reason: `Soil phosphorus is ${pStatus} (${input.phosphorus} ppm); promotes root development`,
            applicationMethod: 'Mix in top 15cm soil before sowing',
        });
    }

    // Potassium recommendation using MOP
    if (neededK > 5) {
        const mopKgAcre = Math.round((neededK / 0.60) * 10) / 10; // MOP is 60% K2O
        fertilizers.push({
            name: 'MOP (Muriate of Potash)', hindiName: 'पोटाश',
            quantity: mopKgAcre,
            unit: 'kg/acre',
            timing: 'Basal application before sowing',
            cost: Math.round((mopKgAcre / 50) * 1100),
            reason: `Soil potassium is ${kStatus} (${input.potassium} ppm); improves crop quality and disease resistance`,
            applicationMethod: 'Broadcast and incorporate into soil',
        });
    }

    // Micronutrient: Zinc is commonly deficient in Indian soils
    if (['wheat', 'rice', 'maize', 'cotton'].includes(cropKey)) {
        fertilizers.push({
            name: 'Zinc Sulphate', hindiName: 'जिंक सल्फेट',
            quantity: 5,
            unit: 'kg/acre',
            timing: 'Basal application or foliar spray at 30 days',
            cost: Math.round((5 / 25) * 1200),
            reason: 'Zinc is commonly deficient in Indian soils; prevents Khaira disease in rice',
            applicationMethod: 'Soil application with basal dose or 0.5% foliar spray',
        });
    }

    // Organic option
    fertilizers.push({
        name: 'Vermicompost', hindiName: 'वर्मीकम्पोस्ट',
        quantity: 200,
        unit: 'kg/acre',
        timing: '2–3 weeks before sowing',
        cost: Math.round((200 / 50) * 200),
        reason: 'Improves soil health, water retention, and microbial activity',
        applicationMethod: 'Broadcast and incorporate into top 15cm soil',
    });

    const totalCostPerAcre = fertilizers.reduce((sum, f) => sum + f.cost, 0);
    const totalCost = Math.round(totalCostPerAcre * area);

    // Soil health advice
    const issues: string[] = [];
    if (nStatus === 'Very Low' || nStatus === 'Low') issues.push('Low nitrogen — consider green manure crop next season');
    if (pStatus === 'Very Low' || pStatus === 'Low') issues.push('Low phosphorus — improve with organic matter');
    if (kStatus === 'Very Low' || kStatus === 'Low') issues.push('Low potassium — banana peel compost helps naturally');

    const soilHealthAdvice = issues.length > 0
        ? issues.join('. ') + '. Regular soil testing every 2–3 years is recommended.'
        : 'Soil nutrient levels are adequate. Maintain with balanced fertilization.';

    return {
        crop: input.cropType,
        fertilizers,
        totalCostPerAcre,
        totalCost,
        areaInAcres: area,
        soilHealthAdvice,
        organicAlternative: `Apply FYM (Farm Yard Manure) @ 5 tonnes/acre + Biofertilizers (Rhizobium/PSB/KSB) to reduce chemical fertilizer requirement by 25%.`,
        applicationSchedule: requirements.notes,
    };
}
