// diseaseDetectionService.ts
// Symptom-based plant disease detection for Indian agricultural crops

export interface DiseaseProfile {
    name: string;
    hindiName: string;
    cropsAffected: string[];
    symptoms: string[];
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    cause: string;
    description: string;
    controlMethods: string[];
    preventiveMeasures: string[];
    organicTreatment: string;
    estimatedYieldLoss: string;
}

export const diseaseProfiles: DiseaseProfile[] = [
    {
        name: 'Powdery Mildew',
        hindiName: 'चूर्णिल फफूंदी',
        cropsAffected: ['Wheat', 'Barley', 'Peas', 'Mustard', 'Cucumber'],
        symptoms: ['White spots on leaves', 'White powdery coating', 'Leaf curling', 'Yellow leaves', 'Stunted growth'],
        severity: 'Medium',
        cause: 'Fungal (Erysiphe spp.)',
        description: 'Fungal disease forming white powdery growth on leaf surfaces. Spreads in dry conditions with moderate temperatures.',
        controlMethods: [
            'Apply sulfur-based fungicide (Wettable Sulfur @ 3g/L)',
            'Spray Hexaconazole 5% EC @ 2ml/L water',
            'Use Propiconazole 25% EC @ 1ml/L at 14-day intervals',
            'Remove and destroy infected plant parts',
        ],
        preventiveMeasures: [
            'Maintain proper plant spacing for good air circulation',
            'Avoid overhead irrigation; use drip irrigation',
            'Plant resistant varieties like WH-147 for wheat',
            'Crop rotation with non-host crops',
        ],
        organicTreatment: 'Spray baking soda solution (1 tsp per liter water) or neem oil (5ml/L) weekly',
        estimatedYieldLoss: '10–30%',
    },
    {
        name: 'Bacterial Blight',
        hindiName: 'जीवाणु झुलसा',
        cropsAffected: ['Rice', 'Cotton', 'Soybean', 'Tomato'],
        symptoms: ['Water-soaked lesions', 'Yellow leaves', 'Wilting', 'Brown spots', 'Leaf curling'],
        severity: 'High',
        cause: 'Bacterial (Xanthomonas spp.)',
        description: 'Bacterial disease causing water-soaked lesions that turn yellow and brown. Spreads rapidly in warm, humid conditions.',
        controlMethods: [
            'Spray Copper Oxychloride 50% WP @ 3g/L water',
            'Apply Streptomycin Sulphate + Tetracycline @ 0.5g/L',
            'Bordeaux mixture 1% spray',
            'Remove severely infected plants to prevent spread',
        ],
        preventiveMeasures: [
            'Use certified disease-free seeds',
            'Treat seeds with Streptomycin 0.01% before sowing',
            'Avoid waterlogging and excess nitrogen fertilization',
            'Plant resistant varieties',
        ],
        organicTreatment: 'Spray garlic extract (50g crushed garlic in 1L water) or Trichoderma viride biocontrol agent',
        estimatedYieldLoss: '20–50%',
    },
    {
        name: 'Rust Disease',
        hindiName: 'रतुआ रोग',
        cropsAffected: ['Wheat', 'Soybean', 'Groundnut', 'Maize', 'Barley'],
        symptoms: ['Rust-colored pustules', 'Yellow leaves', 'Brown spots', 'Leaf curling', 'Stunted growth'],
        severity: 'High',
        cause: 'Fungal (Puccinia spp.)',
        description: 'Fungal disease producing orange-rust colored spore masses on leaves. Major wheat disease that can cause significant crop loss.',
        controlMethods: [
            'Apply Propiconazole 25% EC @ 1ml/L at disease onset',
            'Spray Mancozeb 75% WP @ 2.5g/L',
            'Tebuconazole 25.9% EC @ 1ml/L for systemic control',
            'Spray at 15-day intervals until disease is controlled',
        ],
        preventiveMeasures: [
            'Grow rust-resistant varieties (HD-2781, DBW-17 for wheat)',
            'Early sowing to escape peak rust season',
            'Avoid dense planting; maintain row spacing',
            'Monitor crops regularly after heading',
        ],
        organicTreatment: 'Fermented cow urine spray (diluted 1:10) or neem cake soil application',
        estimatedYieldLoss: '15–40%',
    },
    {
        name: 'Leaf Blight',
        hindiName: 'पत्ती झुलसा',
        cropsAffected: ['Rice', 'Maize', 'Wheat', 'Barley', 'Sugarcane'],
        symptoms: ['Brown spots', 'Yellow leaves', 'Water-soaked lesions', 'Stunted growth', 'Wilting'],
        severity: 'Medium',
        cause: 'Fungal (Helminthosporium spp. / Bipolaris spp.)',
        description: 'Fungal leaf blight causing brownish water-soaked lesions on leaves. Thrives in wet weather conditions.',
        controlMethods: [
            'Spray Mancozeb 75% WP @ 2g/L water',
            'Apply Carbendazim 50% WP @ 1g/L',
            'Iprodione 50% WP @ 2g/L as protective spray',
            'Drain standing water to reduce leaf wetness',
        ],
        preventiveMeasures: [
            'Balanced fertilization — avoid excess nitrogen',
            'Seed treatment with Thiram 75% WP @ 3g/kg seed',
            'Remove crop residues after harvest',
            'Maintain optimal plant population',
        ],
        organicTreatment: 'Spray Pseudomonas fluorescens @ 2.5kg/ha or Trichoderma harzianum bio-agent',
        estimatedYieldLoss: '10–25%',
    },
    {
        name: 'Fusarium Wilt',
        hindiName: 'उकठा रोग',
        cropsAffected: ['Tomato', 'Chili', 'Cotton', 'Chickpea', 'Banana'],
        symptoms: ['Wilting', 'Yellow leaves', 'Stunted growth', 'Brown spots'],
        severity: 'Critical',
        cause: 'Fungal (Fusarium oxysporum)',
        description: 'Soil-borne fungal disease causing vascular wilting. Infected plants wilt suddenly, often one branch at a time.',
        controlMethods: [
            'Soil drenching with Carbendazim 50% WP @ 1g/L',
            'Apply Trichoderma viride 1% WP @ 4–6g/kg seed for treatment',
            'Remove and destroy infected plants immediately',
            'Avoid planting susceptible varieties in infected fields',
        ],
        preventiveMeasures: [
            'Soil solarization before planting (cover with transparent plastic for 6 weeks)',
            'Long crop rotation (4+ years) with non-host crops',
            'Seed treatment with Thiram + Carbendazim',
            'Avoid over-irrigation and improve drainage',
        ],
        organicTreatment: 'Mix Trichoderma harzianum (4kg/ha) in FYM and apply to soil before sowing',
        estimatedYieldLoss: '30–70%',
    },
    {
        name: 'Downy Mildew',
        hindiName: 'मृदुरोमिल फफूंदी',
        cropsAffected: ['Pearl Millet', 'Maize', 'Grapes', 'Cucumber', 'Soybean'],
        symptoms: ['Yellow spots on upper leaf surface', 'White powdery coating', 'Stunted growth', 'Leaf curling'],
        severity: 'High',
        cause: 'Oomycete (Sclerospora spp. / Plasmopara spp.)',
        description: 'Water mold disease causing yellow spots on upper leaf surfaces with white downy growth underneath.',
        controlMethods: [
            'Spray Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/L',
            'Apply Fosetyl-Al 80% WP @ 3g/L',
            'Cymoxanil + Mancozeb spray at weekly intervals',
            'Ensure good drainage and ventilation',
        ],
        preventiveMeasures: [
            'Use Metalaxyl-treated seeds',
            'Avoid irrigating in the evening',
            'Plant resistant hybrids (HHB-67 for pearl millet)',
            'Maintain proper row spacing',
        ],
        organicTreatment: 'Spray copper-based Bordeaux mixture 1% or neem oil 2% at disease appearance',
        estimatedYieldLoss: '20–45%',
    },
    {
        name: 'Blast Disease',
        hindiName: 'ब्लास्ट रोग',
        cropsAffected: ['Rice', 'Wheat', 'Pearl Millet'],
        symptoms: ['Brown spots', 'Water-soaked lesions', 'Stunted growth', 'White spots on leaves', 'Yellow leaves'],
        severity: 'Critical',
        cause: 'Fungal (Magnaporthe oryzae)',
        description: 'Highly destructive rice disease causing diamond-shaped lesions on leaves and neck rot during heading.',
        controlMethods: [
            'Spray Tricyclazole 75% WP @ 0.6g/L at initial symptoms',
            'Apply Isoprothiolane 40% EC @ 1.5ml/L',
            'Carbendazim 50% WP @ 1g/L as preventive spray',
            'Drain fields for 3–5 days at tillering and panicle stages',
        ],
        preventiveMeasures: [
            'Plant blast-resistant varieties (Samba Mahsuri, IR-64)',
            'Balanced nitrogen application — avoid excess',
            'Maintain 2–3 cm water level in fields',
            'Silica-based fertilizers improve blast resistance',
        ],
        organicTreatment: 'Apply silicon-rich paddy straw compost or spray silica solution (2kg silica gel/ha)',
        estimatedYieldLoss: '20–80% in severe cases',
    },
    {
        name: 'Aphid Infestation',
        hindiName: 'माहू कीट',
        cropsAffected: ['Mustard', 'Wheat', 'Cotton', 'Chickpea', 'Vegetables'],
        symptoms: ['Yellow leaves', 'Leaf curling', 'Stunted growth', 'White spots on leaves'],
        severity: 'Medium',
        cause: 'Insect pest (Aphididae family)',
        description: 'Sap-sucking insects that cluster on young shoots and leaves, causing yellowing and curling.',
        controlMethods: [
            'Spray Imidacloprid 17.8% SL @ 0.5ml/L water',
            'Apply Dimethoate 30% EC @ 2ml/L',
            'Thiamethoxam 25% WG @ 0.5g/L as foliar spray',
            'Repeat after 10–15 days if infestation persists',
        ],
        preventiveMeasures: [
            'Encourage natural predators (ladybirds, lacewings)',
            'Avoid excess nitrogen which promotes lush growth',
            'Yellow sticky traps for early monitoring',
            'Timely crop rotation',
        ],
        organicTreatment: 'Spray neem oil 2% or soap water (5g soap per liter) on affected plants',
        estimatedYieldLoss: '10–30%',
    },
];

export interface DetectionInput {
    symptoms: string[];
    cropType: string;
}

export interface DetectionResult {
    disease: string;
    hindiName: string;
    confidence: number;
    severity: string;
    cause: string;
    description: string;
    controlMethods: string[];
    preventiveMeasures: string[];
    organicTreatment: string;
    estimatedYieldLoss: string;
    matchedSymptoms: string[];
}

// Normalize symptom text for comparison
function normalizeSymptom(s: string): string {
    return s.toLowerCase().replace(/[^a-z ]/g, '').trim();
}

export function detectDisease(input: DetectionInput): DetectionResult | null {
    const inputSymptoms = input.symptoms.map(normalizeSymptom);
    const crop = input.cropType;

    let bestMatch: { profile: DiseaseProfile; matchedSymptoms: string[]; score: number } | null = null;

    for (const profile of diseaseProfiles) {
        // Check if disease affects this crop (or check all if crop not in list)
        const cropMatch = profile.cropsAffected.some(
            c => c.toLowerCase() === crop.toLowerCase()
        );
        const cropBonus = cropMatch ? 20 : 0;

        // Count symptom matches
        const matchedSymptoms: string[] = [];
        for (const ds of profile.symptoms) {
            const normalized = normalizeSymptom(ds);
            for (const is of inputSymptoms) {
                // Partial match — check if any words overlap
                const dsWords = normalized.split(' ');
                const isWords = is.split(' ');
                const overlap = dsWords.some(w => isWords.some(iw => iw.length > 3 && (w.includes(iw) || iw.includes(w))));
                if (overlap && !matchedSymptoms.includes(ds)) {
                    matchedSymptoms.push(ds);
                    break;
                }
            }
        }

        const symptomScore = profile.symptoms.length > 0
            ? (matchedSymptoms.length / profile.symptoms.length) * 80
            : 0;

        const totalScore = symptomScore + cropBonus;

        if (totalScore > 0 && (!bestMatch || totalScore > bestMatch.score)) {
            bestMatch = { profile, matchedSymptoms, score: totalScore };
        }
    }

    if (!bestMatch || bestMatch.matchedSymptoms.length === 0) {
        return null;
    }

    // Calculate confidence: base on symptom match ratio + crop match bonus
    const rawConfidence = Math.min(95, Math.round(bestMatch.score));
    // Boost slightly for more symptoms selected
    const inputBonus = Math.min(5, inputSymptoms.length);
    const confidence = Math.min(97, rawConfidence + inputBonus);

    return {
        disease: bestMatch.profile.name,
        hindiName: bestMatch.profile.hindiName,
        confidence,
        severity: bestMatch.profile.severity,
        cause: bestMatch.profile.cause,
        description: bestMatch.profile.description,
        controlMethods: bestMatch.profile.controlMethods,
        preventiveMeasures: bestMatch.profile.preventiveMeasures,
        organicTreatment: bestMatch.profile.organicTreatment,
        estimatedYieldLoss: bestMatch.profile.estimatedYieldLoss,
        matchedSymptoms: bestMatch.matchedSymptoms,
    };
}
