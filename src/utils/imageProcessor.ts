// imageProcessor.ts — Image preprocessing pipeline for CNN disease detection

import sharp from 'sharp';

export interface ProcessedImage {
    pixels: Float32Array; // Normalized pixel values [0, 1]
    width: number;
    height: number;
    channels: number; // 3 for RGB
}

/**
 * Preprocess an image buffer for CNN inference:
 * 1. Resize to targetSize x targetSize
 * 2. Convert to RGB (3 channels)
 * 3. Normalize pixel values to [0, 1]
 */
export async function preprocessImage(
    imageBuffer: Buffer,
    targetSize = 224
): Promise<ProcessedImage> {
    const rawBuffer = await sharp(imageBuffer)
        .resize(targetSize, targetSize, { fit: 'fill' })
        .removeAlpha()
        .toColorspace('srgb')
        .raw()
        .toBuffer();

    const pixels = new Float32Array(targetSize * targetSize * 3);
    for (let i = 0; i < rawBuffer.length; i++) {
        pixels[i] = rawBuffer[i] / 255.0; // Normalize to [0, 1]
    }

    return { pixels, width: targetSize, height: targetSize, channels: 3 };
}

/**
 * Extract basic visual features from an image without a neural network.
 * Used as a fallback when a TF.js model is not available.
 *
 * Returns an object with dominant colour statistics and brightness that
 * the rule-based disease classifier can use.
 */
export interface ImageFeatures {
    averageR: number;
    averageG: number;
    averageB: number;
    brightness: number;       // 0–1
    greenRatio: number;       // how green the image is (0–1)
    yellowScore: number;      // indicator of yellowness (0–1)
    brownScore: number;       // indicator of brownness (0–1)
    darkSpotScore: number;    // proportion of very dark pixels (0–1)
    whiteCoatingScore: number; // proportion of very bright pixels (0–1)
}

export async function extractImageFeatures(imageBuffer: Buffer): Promise<ImageFeatures> {
    const processed = await preprocessImage(imageBuffer, 64); // Smaller for speed
    const { pixels, width, height } = processed;
    const numPixels = width * height;

    let rSum = 0, gSum = 0, bSum = 0;
    let darkCount = 0, brightCount = 0;

    for (let i = 0; i < numPixels; i++) {
        const r = pixels[i * 3];
        const g = pixels[i * 3 + 1];
        const b = pixels[i * 3 + 2];
        rSum += r; gSum += g; bSum += b;
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        if (luma < 0.25) darkCount++;
        if (luma > 0.80) brightCount++;
    }

    const avgR = rSum / numPixels;
    const avgG = gSum / numPixels;
    const avgB = bSum / numPixels;
    const brightness = (avgR + avgG + avgB) / 3;

    // Green channel dominance
    const greenRatio = avgG / (avgR + avgG + avgB + 1e-6);

    // Yellowness: high R + high G, low B
    const yellowScore = Math.min(1, Math.max(0, (avgR + avgG - 2 * avgB) / 1.5));

    // Brownness: moderate R, low G, low B
    const brownScore = Math.min(1, Math.max(0, (avgR - avgG - avgB + 0.5) * 2));

    return {
        averageR: avgR,
        averageG: avgG,
        averageB: avgB,
        brightness,
        greenRatio,
        yellowScore,
        brownScore,
        darkSpotScore: darkCount / numPixels,
        whiteCoatingScore: brightCount / numPixels,
    };
}
