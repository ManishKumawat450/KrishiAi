import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

const CROPS = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Chickpea', 'Mustard', 'Soybean', 'Tomato', 'Groundnut', 'Onion'];

interface FertilizerItem {
  name: string;
  hindiName?: string;
  cost: number;
  quantity: number;
  unit: string;
  timing: string;
  reason?: string;
  applicationMethod?: string;
}

interface FertilizerResult {
  crop?: string;
  fertilizers?: FertilizerItem[];
  totalCost?: number;
  totalCostPerAcre?: number;
  areaInAcres?: number;
  soilHealthAdvice?: string;
  organicAlternative?: string;
  applicationSchedule?: string;
}

export default function FertilizerGuide() {
  const [cropType, setCropType] = useState('Rice');
  const [nitrogen, setNitrogen] = useState(30);
  const [phosphorus, setPhosphorus] = useState(15);
  const [potassium, setPotassium] = useState(20);
  const [result, setResult] = useState<FertilizerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE}/fertilizer/recommend`, {
        cropType,
        nitrogen,
        phosphorus,
        potassium,
        areaInAcres: 1
      });
      setResult(response.data.data);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Error getting recommendations'
        : 'Error getting recommendations';
      setError(message);
      setResult(null);
    }
    
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">🧪 Fertilizer Guide</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Optimize nutrient mix with clear recommendations and cost guidance.</p>
      </header>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md backdrop-blur-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Soil Analysis</h2>
          <p className="mt-1 text-sm text-slate-600">Adjust macro nutrients to receive an actionable fertilizer plan.</p>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label htmlFor="fert-crop" className="mb-2 block text-sm font-semibold text-slate-800">Crop Type</label>
              <select
                id="fert-crop"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition-colors duration-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
              >
                {CROPS.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="nitrogen" className="mb-2 block text-sm font-semibold text-slate-800">
                Nitrogen: <span className="text-emerald-700">{nitrogen} ppm</span>
              </label>
              <input
                id="nitrogen"
                type="range"
                min="0"
                max="200"
                value={nitrogen}
                onChange={(e) => setNitrogen(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-emerald-100"
              />
            </div>

            <div>
              <label htmlFor="phosphorus" className="mb-2 block text-sm font-semibold text-slate-800">
                Phosphorus: <span className="text-cyan-700">{phosphorus} ppm</span>
              </label>
              <input
                id="phosphorus"
                type="range"
                min="0"
                max="100"
                value={phosphorus}
                onChange={(e) => setPhosphorus(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-cyan-100"
              />
            </div>

            <div>
              <label htmlFor="potassium" className="mb-2 block text-sm font-semibold text-slate-800">
                Potassium: <span className="text-amber-700">{potassium} ppm</span>
              </label>
              <input
                id="potassium"
                type="range"
                min="0"
                max="150"
                value={potassium}
                onChange={(e) => setPotassium(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-amber-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(217,119,6,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? '⏳ Analyzing...' : '🧪 Get Recommendations'}
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
              ❌ {error}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md backdrop-blur-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Recommendations</h2>
          <p className="mt-1 text-sm text-slate-600">Balanced fertilizer set with timing and cost for one acre.</p>
          
          <div className="mt-6" aria-live="polite">
            {loading && (
              <div className="space-y-3" role="status">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="h-5 w-2/5 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && !result && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                Adjust nutrient levels and submit to receive fertilizer recommendations.
              </div>
            )}

            {!loading && !error && result && (
              <div className="space-y-4">
                {result.fertilizers && result.fertilizers.map((fert, idx) => (
                  <article key={`${fert.name}-${idx}`} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{fert.name}</h3>
                        {fert.hindiName && <p className="text-xs text-slate-500">{fert.hindiName}</p>}
                      </div>
                      <span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                        ₹{fert.cost}/acre
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-slate-700">
                      <p><strong>Quantity:</strong> {fert.quantity} {fert.unit}</p>
                      <p><strong>Timing:</strong> {fert.timing}</p>
                      {fert.applicationMethod && <p><strong>How:</strong> {fert.applicationMethod}</p>}
                      {fert.reason && <p className="text-xs text-slate-500 mt-1 italic">{fert.reason}</p>}
                    </div>
                  </article>
                ))}

                <article className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-sm opacity-80">Total Cost ({result.areaInAcres ?? 1} acre{(result.areaInAcres ?? 1) > 1 ? 's' : ''})</p>
                      <p className="mt-1 text-4xl font-black">₹{result.totalCost ?? result.totalCostPerAcre}</p>
                    </div>
                    {result.areaInAcres && result.areaInAcres > 1 && result.totalCostPerAcre && (
                      <div className="text-right text-sm opacity-80">
                        <p>Per acre: ₹{result.totalCostPerAcre}</p>
                      </div>
                    )}
                  </div>
                </article>

                {result.applicationSchedule && (
                  <article className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1">Application Schedule</p>
                    <p className="text-sm text-blue-800">{result.applicationSchedule}</p>
                  </article>
                )}

                {result.soilHealthAdvice && (
                  <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">🌱 Soil Health Advice</p>
                    <p className="text-sm text-emerald-800">{result.soilHealthAdvice}</p>
                  </article>
                )}

                {result.organicAlternative && (
                  <article className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-1">🌿 Organic Alternative</p>
                    <p className="text-sm text-green-800">{result.organicAlternative}</p>
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