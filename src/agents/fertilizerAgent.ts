class FertilizerAgent {
    
    // Method to recommend fertilizers based on soil nutrient levels and crop type
    recommendFertilizer(nutrients: { nitrogen: number; phosphorus: number; potassium: number; }, cropType: string): string {
        let recommendation = '';
        
        // Basic logic for fertilizer recommendation
        if (cropType === 'rice') {
            if (nutrients.nitrogen < 30) {
                recommendation += 'Use Urea for nitrogen deficiency.\n';
            }
            if (nutrients.phosphorus < 10) {
                recommendation += 'Add Superphosphate for phosphorus deficiency.\n';
            }
            if (nutrients.potassium < 20) {
                recommendation += 'Consider Muriate of Potash for potassium deficiency.\n';
            }
        } else if (cropType === 'wheat') {
            if (nutrients.nitrogen < 25) {
                recommendation += 'Use Ammonium Nitrate for nitrogen deficiency.\n';
            }
            if (nutrients.phosphorus < 15) {
                recommendation += 'Add DAP for phosphorus deficiency.\n';
            }
            if (nutrients.potassium < 20) {
                recommendation += 'Consider Potassium Sulfate for potassium deficiency.\n';
            }
        } else {
            recommendation = 'Crop type not recognized. Unable to recommend fertilizers.';
        }
        
        return recommendation;
    }
}

// Example usage:
const agent = new FertilizerAgent();
const nutrients = { nitrogen: 20, phosphorus: 5, potassium: 15 };
const cropType = 'rice';
const recommendations = agent.recommendFertilizer(nutrients, cropType);
console.log(recommendations);
