// priceAgent.ts — Price prediction agent (uses priceService for full implementation)

import { predictPrice } from '../services/priceService';

export async function getPricePrediction(cropName: string, daysAhead = 7): Promise<number | null> {
    const result = predictPrice(cropName, daysAhead);
    return result ? result.predictedPrice : null;
}

export default { getPricePrediction };
