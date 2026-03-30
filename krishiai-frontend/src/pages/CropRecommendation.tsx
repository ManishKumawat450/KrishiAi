import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

interface CropOption {
  name: string;
  hindiName?: string;
  suitability: number;
  season?: string;
  reason?: string;
  avgPrice?: number;
}

interface CropRecommendationData {
  recommendations?: {
    crop1?: CropOption;
    crop2?: CropOption;
    crop3?: CropOption;
  };
}

export default function CropRecommendation() {
  const [temp, setTemp] = useState(28);
  const [rainfall, setRainfall] = useState(100);
  const [ph, setPh] = useState(6.5);
  const [result, setResult] = useState<CropRecommendationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE}/crops/recommend`, {
        temperature: temp,
        rainfall,
        phLevel: ph
      });
      setResult(response.data.data);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Error getting recommendations'
        : 'Error getting recommendations';
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const recommendations = [
    result?.recommendations?.crop1,
    result?.recommendations?.crop2,
    result?.recommendations?.crop3,
  ].filter((item): item is CropOption => Boolean(item));

  const badgeStyles = [
    'border-emerald-200 bg-emerald-100 text-emerald-800',
    'border-amber-200 bg-amber-100 text-amber-800',
    'border-orange-200 bg-orange-100 text-orange-800',
  ];

  const progressStyles = ['from-emerald-300 to-emerald-500', 'from-amber-300 to-amber-500', 'from-orange-300 to-orange-500'];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">🌱 Crop Recommendation</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Adjust your farm conditions and get ranked crop options from the recommendation engine.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md backdrop-blur-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Farm Conditions</h2>
          <p className="mt-1 text-sm text-slate-600">Tune inputs precisely to match your local field profile.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label htmlFor="temperature" className="mb-2 block text-sm font-semibold text-slate-800">
                Temperature: <span className="text-emerald-700">{temp}°C</span>
              </label>
              <input
                id="temperature"
                type="range"
                min="-10"
                max="50"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-emerald-100"
                aria-describedby="temperature-help"
              />
              <p id="temperature-help" className="mt-1 text-xs text-slate-500">Expected local average in Celsius.</p>
            </div>

            <div>
              <label htmlFor="rainfall" className="mb-2 block text-sm font-semibold text-slate-800">
                Rainfall: <span className="text-cyan-700">{rainfall} mm</span>
              </label>
              <input
                id="rainfall"
                type="range"
                min="0"
                max="300"
                value={rainfall}
                onChange={(e) => setRainfall(parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-cyan-100"
                aria-describedby="rainfall-help"
              />
              <p id="rainfall-help" className="mt-1 text-xs text-slate-500">Estimated rainfall in millimeters.</p>
            </div>

            <div>
              <label htmlFor="soil-ph" className="mb-2 block text-sm font-semibold text-slate-800">
                Soil pH: <span className="text-violet-700">{ph.toFixed(1)}</span>
              </label>
              <input
                id="soil-ph"
                type="range"
                min="4"
                max="9"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-violet-100"
                aria-describedby="ph-help"
              />
              <p id="ph-help" className="mt-1 text-xs text-slate-500">Ideal farming range is typically between 5.5 and 7.5.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(22,163,74,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? '⏳ Getting recommendations...' : '🚀 Get Recommendations'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md backdrop-blur-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Recommendations</h2>
          <p className="mt-1 text-sm text-slate-600">Ranked by suitability for your selected conditions.</p>

          <div className="mt-6" aria-live="polite">
            {loading && (
              <div className="space-y-3" role="status">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-2 w-full animate-pulse rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
                <p>❌ {error}</p>
              </div>
            )}

            {!loading && !error && recommendations.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                Enter your farm details and submit to see crop recommendations.
              </div>
            )}

            {!loading && !error && recommendations.length > 0 && (
              <div className="space-y-3">
                {recommendations.map((crop, index) => (
                  <article key={`${crop.name}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-base font-bold text-slate-900 sm:text-lg">{crop.name}</p>
                        {crop.hindiName && (
                          <p className="text-xs text-slate-500">{crop.hindiName}</p>
                        )}
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${badgeStyles[index] || badgeStyles[2]}`}>
                        {crop.suitability}% match
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-200">
                      <div
                        className={`h-2.5 rounded-full bg-gradient-to-r ${progressStyles[index] || progressStyles[2]} transition-all duration-500`}
                        style={{ width: `${crop.suitability}%` }}
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={crop.suitability}
                        aria-label={`${crop.name} suitability`}
                      />
                    </div>
                    {(crop.season || crop.reason || crop.avgPrice) && (
                      <div className="mt-3 grid grid-cols-1 gap-1.5 text-xs text-slate-600 sm:grid-cols-3">
                        {crop.season && (
                          <div className="rounded-lg bg-white/80 px-2.5 py-1.5">
                            <span className="font-semibold text-slate-700">📅 Season: </span>{crop.season}
                          </div>
                        )}
                        {crop.avgPrice !== undefined && (
                          <div className="rounded-lg bg-white/80 px-2.5 py-1.5">
                            <span className="font-semibold text-slate-700">💰 Avg Price: </span>₹{crop.avgPrice}/q
                          </div>
                        )}
                        {crop.reason && (
                          <div className="rounded-lg bg-white/80 px-2.5 py-1.5 sm:col-span-3">
                            <span className="font-semibold text-slate-700">ℹ️ Why: </span>{crop.reason}
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}