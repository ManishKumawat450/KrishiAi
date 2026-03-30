// diseaseAgent.ts — Disease detection agent (uses diseaseDetectionService for full implementation)

import { detectDisease } from '../services/diseaseDetectionService';

export function detectCropDisease(symptoms: string[], cropType: string) {
    return detectDisease({ symptoms, cropType });
}

export default { detectCropDisease };
