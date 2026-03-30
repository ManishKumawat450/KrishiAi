// priceService.ts
// Realistic Indian mandi (agricultural market) price data and prediction engine

export interface MandiPrice {
    crop: string;
    hindiName: string;
    unit: string;
    basePrice: number; // INR per quintal (100kg)
    msp: number;       // Minimum Support Price
    sevenDayHistory: number[];
    markets: string[];
}

// Realistic current mandi prices for major Indian crops (March 2026)
const mandiPrices: Record<string, MandiPrice> = {
    wheat: {
        crop: 'Wheat', hindiName: 'गेहूं', unit: 'INR/quintal',
        basePrice: 2200, msp: 2275,
        sevenDayHistory: [2180, 2195, 2210, 2200, 2215, 2205, 2200],
        markets: ['Ludhiana', 'Karnal', 'Hapur', 'Bhopal', 'Indore'],
    },
    rice: {
        crop: 'Rice', hindiName: 'धान', unit: 'INR/quintal',
        basePrice: 2300, msp: 2183,
        sevenDayHistory: [2250, 2270, 2280, 2295, 2310, 2305, 2300],
        markets: ['Amritsar', 'Karnal', 'Cuttack', 'Rajahmundry', 'Thanjavur'],
    },
    cotton: {
        crop: 'Cotton', hindiName: 'कपास', unit: 'INR/quintal',
        basePrice: 6100, msp: 6620,
        sevenDayHistory: [6080, 6050, 6090, 6110, 6100, 6120, 6100],
        markets: ['Rajkot', 'Akola', 'Adilabad', 'Sirsa', 'Nandurbar'],
    },
    sugarcane: {
        crop: 'Sugarcane', hindiName: 'गन्ना', unit: 'INR/quintal',
        basePrice: 340, msp: 315,
        sevenDayHistory: [335, 338, 340, 342, 340, 338, 340],
        markets: ['Muzaffarnagar', 'Meerut', 'Satara', 'Belgaum', 'Mandya'],
    },
    maize: {
        crop: 'Maize', hindiName: 'मक्का', unit: 'INR/quintal',
        basePrice: 1850, msp: 1870,
        sevenDayHistory: [1820, 1830, 1840, 1845, 1855, 1848, 1850],
        markets: ['Davangere', 'Nizamabad', 'Bhagalpur', 'Kota', 'Chhatarpur'],
    },
    soybean: {
        crop: 'Soybean', hindiName: 'सोयाबीन', unit: 'INR/quintal',
        basePrice: 4100, msp: 4600,
        sevenDayHistory: [4050, 4060, 4080, 4100, 4110, 4095, 4100],
        markets: ['Indore', 'Bhopal', 'Latur', 'Nagpur', 'Ujjain'],
    },
    mustard: {
        crop: 'Mustard', hindiName: 'सरसों', unit: 'INR/quintal',
        basePrice: 5300, msp: 5650,
        sevenDayHistory: [5250, 5270, 5280, 5300, 5320, 5310, 5300],
        markets: ['Jaipur', 'Alwar', 'Mathura', 'Hisar', 'Bharatpur'],
    },
    chickpea: {
        crop: 'Chickpea', hindiName: 'चना', unit: 'INR/quintal',
        basePrice: 5200, msp: 5440,
        sevenDayHistory: [5150, 5160, 5180, 5200, 5210, 5205, 5200],
        markets: ['Indore', 'Nanded', 'Bidar', 'Gulbarga', 'Akola'],
    },
    groundnut: {
        crop: 'Groundnut', hindiName: 'मूंगफली', unit: 'INR/quintal',
        basePrice: 5500, msp: 5850,
        sevenDayHistory: [5450, 5460, 5480, 5490, 5510, 5500, 5500],
        markets: ['Rajkot', 'Junagadh', 'Anantapur', 'Tirunelveli', 'Davangere'],
    },
    tomato: {
        crop: 'Tomato', hindiName: 'टमाटर', unit: 'INR/quintal',
        basePrice: 1600, msp: 0, // No MSP for vegetables
        sevenDayHistory: [1400, 1450, 1500, 1550, 1600, 1620, 1600],
        markets: ['Kolar', 'Nashik', 'Chitradurga', 'Madanapalle', 'Pune'],
    },
    onion: {
        crop: 'Onion', hindiName: 'प्याज', unit: 'INR/quintal',
        basePrice: 1200, msp: 0,
        sevenDayHistory: [1100, 1120, 1150, 1170, 1200, 1210, 1200],
        markets: ['Lasalgaon', 'Pimpalgaon', 'Solapur', 'Hubli', 'Indore'],
    },
};

// Seasonal price factors (month 1–12)
const seasonalFactors: Record<string, number[]> = {
    wheat:     [1.02, 1.01, 1.00, 0.96, 0.95, 0.98, 1.01, 1.02, 1.03, 1.04, 1.03, 1.02],
    rice:      [1.00, 1.01, 1.01, 1.00, 0.98, 0.97, 0.96, 0.98, 0.99, 1.02, 1.03, 1.02],
    cotton:    [1.00, 0.99, 0.98, 0.97, 0.98, 1.00, 1.01, 1.02, 1.03, 1.04, 1.03, 1.01],
    sugarcane: [1.00, 1.00, 1.01, 1.01, 0.99, 0.98, 0.98, 0.99, 1.00, 1.01, 1.01, 1.00],
    maize:     [1.01, 1.00, 0.99, 0.98, 0.97, 0.98, 0.99, 1.01, 1.02, 1.03, 1.02, 1.01],
    mustard:   [1.02, 1.01, 1.00, 0.98, 0.97, 0.98, 1.00, 1.01, 1.02, 1.03, 1.02, 1.02],
    soybean:   [1.00, 0.99, 0.98, 0.97, 0.98, 0.99, 1.00, 1.01, 1.02, 1.03, 1.02, 1.01],
    chickpea:  [1.02, 1.01, 1.00, 0.99, 0.98, 0.98, 0.99, 1.00, 1.01, 1.02, 1.02, 1.02],
    groundnut: [1.01, 1.00, 0.99, 0.98, 0.97, 0.98, 1.00, 1.02, 1.03, 1.03, 1.02, 1.01],
    tomato:    [0.95, 0.97, 1.00, 1.05, 1.10, 1.08, 1.02, 0.98, 0.95, 0.97, 0.98, 0.96],
    onion:     [0.95, 0.96, 0.98, 1.00, 1.05, 1.10, 1.08, 1.03, 0.99, 0.97, 0.96, 0.95],
};

export interface PricePredictionResult {
    crop: string;
    hindiName: string;
    currentPrice: number;
    predictedPrice: number;
    unit: string;
    daysAhead: number;
    trend: 'up' | 'down' | 'stable';
    trendPercent: number;
    confidence: number;
    msp: number;
    advice: string;
    priceHistory: { day: string; price: number }[];
    bestSellingMarkets: string[];
}

function computeTrend(history: number[]): { slope: number; avgChange: number } {
    if (history.length < 2) return { slope: 0, avgChange: 0 };
    let totalChange = 0;
    for (let i = 1; i < history.length; i++) {
        totalChange += history[i] - history[i - 1];
    }
    const avgChange = totalChange / (history.length - 1);
    const slope = avgChange / history[0];
    return { slope, avgChange };
}

export function predictPrice(cropName: string, daysAhead: number): PricePredictionResult | null {
    const key = cropName.toLowerCase();
    const data = mandiPrices[key];
    if (!data) return null;

    const { avgChange } = computeTrend(data.sevenDayHistory);

    const month = new Date().getMonth(); // 0-indexed
    const seasonalFactor = (seasonalFactors[key] ?? new Array(12).fill(1.0))[month];

    // Predict price: current + trend * days * seasonal adjustment
    const baseChange = avgChange * daysAhead;
    const seasonalAdjustment = (seasonalFactor - 1) * data.basePrice * (daysAhead / 30);
    const noise = (Math.random() - 0.5) * data.basePrice * 0.005; // ±0.5% noise
    const predictedPrice = Math.round(data.basePrice + baseChange + seasonalAdjustment + noise);

    const trendPercent = Math.round(((predictedPrice - data.basePrice) / data.basePrice) * 1000) / 10;
    const trend: 'up' | 'down' | 'stable' =
        Math.abs(trendPercent) < 0.5 ? 'stable' : trendPercent > 0 ? 'up' : 'down';

    // Confidence decreases with prediction horizon
    const confidence = Math.max(55, Math.round(90 - daysAhead * 1.5));

    // Build recent history labels
    const today = new Date();
    const priceHistory = data.sevenDayHistory.map((price, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (data.sevenDayHistory.length - 1 - i));
        return { day: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), price };
    });

    // Advice
    let advice = '';
    if (trend === 'up' && trendPercent > 1) {
        advice = `📈 Prices rising. Consider holding stock for ${Math.min(daysAhead, 7)} more days for better returns.`;
    } else if (trend === 'down' && trendPercent < -1) {
        advice = `📉 Prices may fall. Sell now or early to maximize returns.`;
    } else if (data.msp > 0 && data.basePrice < data.msp) {
        advice = `⚠️ Current price (₹${data.basePrice}) is below MSP (₹${data.msp}). Sell to government procurement agencies.`;
    } else {
        advice = `✅ Prices are stable. Good time to sell at current market rates.`;
    }

    return {
        crop: data.crop,
        hindiName: data.hindiName,
        currentPrice: data.basePrice,
        predictedPrice,
        unit: data.unit,
        daysAhead,
        trend,
        trendPercent: Math.abs(trendPercent),
        confidence,
        msp: data.msp,
        advice,
        priceHistory,
        bestSellingMarkets: data.markets.slice(0, 3),
    };
}

export function getAvailableCrops(): string[] {
    return Object.values(mandiPrices).map(d => d.crop);
}
