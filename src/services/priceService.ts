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
    confidenceInterval: { lower: number; upper: number };
    msp: number;
    advice: string;
    priceHistory: { day: string; price: number }[];
    bestSellingMarkets: string[];
    forecastMethod: string;
}

// ── Exponential Smoothing (Holt's linear / double exponential) ─────────────────
// alpha: smoothing factor for level (0 < alpha < 1)
// beta:  smoothing factor for trend (0 < beta < 1)
function holtExponentialSmoothing(
    series: number[],
    alpha: number,
    beta: number
): { level: number; trend: number; smoothed: number[] } {
    if (series.length < 2) return { level: series[0] ?? 0, trend: 0, smoothed: series.slice() };

    let level = series[0];
    let trend = series[1] - series[0];
    const smoothed: number[] = [level];

    for (let i = 1; i < series.length; i++) {
        const prevLevel = level;
        level = alpha * series[i] + (1 - alpha) * (prevLevel + trend);
        trend = beta  * (level - prevLevel) + (1 - beta) * trend;
        smoothed.push(level);
    }
    return { level, trend, smoothed };
}

// ── Seasonal decomposition (additive) ─────────────────────────────────────────
function seasonalAdjustment(basePrice: number, key: string, daysAhead: number): number {
    const factors = seasonalFactors[key] ?? new Array(12).fill(1.0);
    const today = new Date();
    const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    const futureMonth = futureDate.getMonth();
    const currentMonth = today.getMonth();
    const currentFactor = factors[currentMonth];
    const futureFactor  = factors[futureMonth];
    // Additive seasonal component
    return basePrice * (futureFactor - currentFactor);
}

// ── Volatility-aware confidence ────────────────────────────────────────────────
function computeVolatility(series: number[]): number {
    if (series.length < 2) return 0;
    const mean = series.reduce((a, b) => a + b, 0) / series.length;
    const variance = series.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / series.length;
    return Math.sqrt(variance) / mean; // coefficient of variation
}

export function predictPrice(cropName: string, daysAhead: number): PricePredictionResult | null {
    const key = cropName.toLowerCase();
    const data = mandiPrices[key];
    if (!data) return null;

    // ── Holt's exponential smoothing on 7-day history ─────────────────────────
    const alpha = 0.4; // level smoothing
    const beta  = 0.3; // trend smoothing
    const { level, trend: holtsSlope, smoothed } = holtExponentialSmoothing(
        data.sevenDayHistory, alpha, beta
    );

    // ── Seasonal adjustment ────────────────────────────────────────────────────
    const seasonal = seasonalAdjustment(data.basePrice, key, daysAhead);

    // ── h-step ahead forecast: level + h * trend + seasonal ───────────────────
    const rawForecast = level + holtsSlope * daysAhead + seasonal;
    const predictedPrice = Math.max(0, Math.round(rawForecast));

    // ── Confidence interval (proportional to volatility and horizon) ──────────
    const volatility = computeVolatility(data.sevenDayHistory);
    const horizonFactor = Math.sqrt(daysAhead);         // uncertainty grows with sqrt(h)
    const intervalWidth = Math.round(predictedPrice * volatility * horizonFactor * 1.96);
    const confidenceInterval = {
        lower: Math.max(0, predictedPrice - intervalWidth),
        upper: predictedPrice + intervalWidth,
    };

    const trendPercent = Math.round(((predictedPrice - data.basePrice) / data.basePrice) * 1000) / 10;
    const trend: 'up' | 'down' | 'stable' =
        Math.abs(trendPercent) < 0.5 ? 'stable' : trendPercent > 0 ? 'up' : 'down';

    // Confidence: higher alpha/beta means better fit; penalise long horizons
    const baseConfidence = 88 - volatility * 100;
    const confidence = Math.max(50, Math.round(baseConfidence - daysAhead * 1.2));

    // Build recent history labels (use smoothed series for display)
    const today = new Date();
    const priceHistory = smoothed.map((price, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (smoothed.length - 1 - i));
        return { day: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), price: Math.round(price) };
    });

    // Advice
    let advice = '';
    if (trend === 'up' && trendPercent > 1) {
        advice = `📈 Prices rising (${trendPercent > 0 ? '+' : ''}${trendPercent}% in ${daysAhead} days). Consider holding stock for better returns.`;
    } else if (trend === 'down' && trendPercent < -1) {
        advice = `📉 Prices may fall by ${Math.abs(trendPercent)}%. Sell now or early to maximise returns.`;
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
        confidenceInterval,
        msp: data.msp,
        advice,
        priceHistory,
        bestSellingMarkets: data.markets.slice(0, 3),
        forecastMethod: "Holt's Exponential Smoothing with Seasonal Decomposition",
    };
}

export function getAvailableCrops(): string[] {
    return Object.values(mandiPrices).map(d => d.crop);
}
