import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

const CROPS = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Soybean', 'Mustard', 'Chickpea', 'Groundnut', 'Tomato', 'Onion'];

interface PriceHistoryItem {
  day: string;
  price: number;
}

interface PricePredictionResult {
  crop: string;
  hindiName?: string;
  daysAhead: number;
  currentPrice: number;
  predictedPrice: number;
  trend: 'up' | 'down' | 'stable' | string;
  trendPercent?: number;
  confidence: number;
  msp?: number;
  advice?: string;
  priceHistory?: PriceHistoryItem[];
  bestSellingMarkets?: string[];
  unit?: string;
}

export default function PricePrediction() {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [days, setDays] = useState(1);
  const [result, setResult] = useState<PricePredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_BASE}/prices/predict`, {
        params: {
          crop: selectedCrop,
          days: days
        }
      });
      setResult(response.data.data);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Error predicting price'
        : 'Error predicting price';
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">💹 Price Prediction</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Estimate market direction and pricing before deciding when to sell.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md backdrop-blur-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Forecast Inputs</h2>
          <p className="mt-1 text-sm text-slate-600">Choose crop and forecast horizon.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label htmlFor="crop-select" className="mb-2 block text-sm font-semibold text-slate-800">Select Crop</label>
              <select
                id="crop-select"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-800 outline-none transition-colors duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
              >
                {CROPS.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="days-ahead" className="mb-2 block text-sm font-semibold text-slate-800">
                Days Ahead: {days}
              </label>
              <input
                id="days-ahead"
                type="range"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-cyan-100"
                aria-describedby="days-help"
              />
              <p id="days-help" className="mt-1 text-xs text-slate-500">Forecast window from 1 to 30 days.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(6,182,212,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? '⏳ Predicting...' : '📊 Get Forecast'}
            </button>
          </form>

          <div className="mt-4 text-xs text-slate-500">
            Tip: shorter windows usually produce more stable confidence.
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md backdrop-blur-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Forecast</h2>
          <p className="mt-1 text-sm text-slate-600">Predicted price, trend, and confidence score.</p>

          <div className="mt-6" aria-live="polite">
            {loading && (
              <div className="space-y-3" role="status">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-10 w-2/3 animate-pulse rounded bg-slate-200" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 animate-pulse rounded-xl border border-slate-200 bg-slate-50" />
                  <div className="h-20 animate-pulse rounded-xl border border-slate-200 bg-slate-50" />
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
                ❌ {error}
              </div>
            )}

            {!loading && !error && !result && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                Select a crop and horizon to generate your market forecast.
              </div>
            )}

            {!loading && !error && result && (
              <div className="space-y-4">
                <article className="rounded-xl border border-cyan-200 bg-cyan-50 p-5">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-sm text-slate-700">
                        <strong>{result.crop}</strong>{result.hindiName && ` (${result.hindiName})`} · {result.daysAhead} days ahead
                      </p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-black text-cyan-700 sm:text-5xl">₹{result.predictedPrice}</span>
                        <span className="text-base text-slate-600">/{result.unit?.replace('INR/', '') ?? 'quintal'}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>Current: <strong>₹{result.currentPrice}</strong></p>
                      {result.msp && result.msp > 0 && <p>MSP: <strong>₹{result.msp}</strong></p>}
                    </div>
                  </div>
                  {result.advice && (
                    <div className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-sm text-slate-700">{result.advice}</div>
                  )}
                </article>

                <div className="grid grid-cols-3 gap-3">
                  <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Trend</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {result.trend === 'up' ? '📈 UP' : result.trend === 'down' ? '📉 DOWN' : '➡️ STABLE'}
                    </p>
                    {result.trendPercent !== undefined && (
                      <p className={`text-xs ${result.trend === 'up' ? 'text-emerald-600' : result.trend === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
                        {result.trendPercent}%
                      </p>
                    )}
                  </article>

                  <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Confidence</p>
                    <p className="mt-2 text-lg font-bold text-emerald-700">{result.confidence}%</p>
                  </article>

                  <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Change</p>
                    <p className={`mt-2 text-lg font-bold ${result.predictedPrice >= result.currentPrice ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {result.predictedPrice >= result.currentPrice ? '+' : ''}₹{result.predictedPrice - result.currentPrice}
                    </p>
                  </article>
                </div>

                {result.bestSellingMarkets && result.bestSellingMarkets.length > 0 && (
                  <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Best Selling Markets</p>
                    <div className="flex flex-wrap gap-2">
                      {result.bestSellingMarkets.map((market, idx) => (
                        <span key={idx} className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800">📍 {market}</span>
                      ))}
                    </div>
                  </article>
                )}

                {result.priceHistory && result.priceHistory.length > 0 && (
                  <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">7-Day Price History</p>
                    <div className="flex items-end gap-1 h-16">
                      {result.priceHistory.map((item, idx) => {
                        const prices = result.priceHistory!.map(h => h.price);
                        const minP = Math.min(...prices);
                        const maxP = Math.max(...prices);
                        const range = maxP - minP || 1;
                        const height = Math.round(((item.price - minP) / range) * 60) + 8;
                        return (
                          <div key={idx} className="flex flex-col items-center flex-1 gap-1">
                            <div
                              className="w-full rounded-t bg-cyan-400"
                              style={{ height: `${height}px` }}
                              title={`₹${item.price}`}
                            />
                            <span className="text-[9px] text-slate-500 truncate w-full text-center">{item.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}