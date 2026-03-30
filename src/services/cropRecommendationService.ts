// cropRecommendationService.ts

// This service provides intelligent crop recommendations based on various soil and climatic factors.

const cropData = [
    {
        name: 'Wheat',
        suitablePHRange: [6.0, 8.0],
        nitrogenRequirement: 'Medium',
        temperatureRange: [10, 25], // Celsius
        rainfall: [500, 1000] // mm
    },
    {
        name: 'Rice',
        suitablePHRange: [5.0, 7.0],
        nitrogenRequirement: 'High',
        temperatureRange: [20, 37],
        rainfall: [1000, 2000]
    },
    {
        name: 'Maize',
        suitablePHRange: [5.8, 7.0],
        nitrogenRequirement: 'High',
        temperatureRange: [18, 30],
        rainfall: [500, 800]
    },
    {
        name: 'Cotton',
        suitablePHRange: [5.5, 8.0],
        nitrogenRequirement: 'Moderate',
        temperatureRange: [20, 32],
        rainfall: [500, 700]
    },
    {
        name: 'Sugarcane',
        suitablePHRange: [6.0, 8.5],
        nitrogenRequirement: 'High',
        temperatureRange: [20, 30],
        rainfall: [1000, 2000]
    }
];

function recommendCrop(pH: number, nitrogen: number, temperature: number, rainfall: number) {
    return cropData.filter(crop => 
        crop.suitablePHRange[0] <= pH && pH <= crop.suitablePHRange[1] && 
        (crop.nitrogenRequirement === 'High' ? nitrogen > 100 : nitrogen <= 100) && 
        crop.temperatureRange[0] <= temperature && temperature <= crop.temperatureRange[1] && 
        crop.rainfall[0] <= rainfall && rainfall <= crop.rainfall[1]
    );
}

export default recommendCrop;