import React from 'react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const featureCards = [
  {
    title: 'Crop Recommendations',
    description:
      'AI-backed crop suggestions based on weather, soil profile, and local conditions.',
    icon: '🌱',
    page: 'crops',
    theme: 'from-emerald-400/20 to-emerald-600/10 border-emerald-300/30',
    cta: 'Explore crops',
  },
  {
    title: 'Disease Detection',
    description:
      'Identify crop diseases quickly and get practical prevention and treatment guidance.',
    icon: '🦠',
    page: 'disease',
    theme: 'from-rose-400/20 to-rose-600/10 border-rose-300/30',
    cta: 'Detect disease',
  },
  {
    title: 'Price Prediction',
    description:
      'Estimate upcoming market price trends to time your sales and improve margins.',
    icon: '💹',
    page: 'price',
    theme: 'from-sky-400/20 to-sky-600/10 border-sky-300/30',
    cta: 'Check prices',
  },
  {
    title: 'Fertilizer Guide',
    description:
      'Receive balanced fertilizer recommendations with practical application guidance.',
    icon: '🧪',
    page: 'fertilizer',
    theme: 'from-amber-300/20 to-amber-600/10 border-amber-300/30',
    cta: 'Optimize fertilizer',
  },
];

const howItWorks = [
  {
    title: 'Enter field details',
    description: 'Provide your crop context, weather, and soil information.',
  },
  {
    title: 'AI processes context',
    description: 'KrishiAI compares your inputs with agricultural intelligence.',
  },
  {
    title: 'Get practical insights',
    description: 'Receive clear recommendations you can act on immediately.',
  },
  {
    title: 'Improve outcomes',
    description: 'Reduce uncertainty and improve yield and decision confidence.',
  },
];

type InsightState = 'ready' | 'loading' | 'empty' | 'error';

const insightState: InsightState = 'ready';

const insightItems = [
  { title: 'Weather pulse', value: 'Monsoon probability stable', tone: 'text-emerald-700' },
  { title: 'Market pulse', value: 'Tomato trend +4.8% weekly', tone: 'text-cyan-700' },
  { title: 'Soil pulse', value: 'Nitrogen advisory available', tone: 'text-amber-700' },
];

export default function Home({ onNavigate }: HomeProps) {
  const renderInsightState = () => {
    if (insightState === 'loading') {
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="status" aria-live="polite">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      );
    }

    if (insightState === 'empty') {
      return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
          No insights yet. Add your farm details to unlock personalized intelligence.
        </div>
      );
    }

    if (insightState === 'error') {
      return (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
          We could not load live insights right now. Please try again in a moment.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-live="polite">
        {insightItems.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{item.title}</p>
            <p className={`mt-2 text-sm font-semibold ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="overflow-hidden pb-8 text-slate-900">
      <section className="relative isolate py-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-emerald-300/35 blur-3xl" />
          <div className="absolute -bottom-16 left-0 h-64 w-64 rounded-full bg-amber-200/45 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="animate-[fadeIn_0.6s_ease-out]">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              <span aria-hidden="true">🌾</span>
              Built for Indian farmers
            </p>
            <h1 className="mt-6 text-balance text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Turn farm uncertainty into confident decisions.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
              KrishiAI brings crop recommendations, disease intelligence, fertilizer planning, and price forecasting into one clear workflow designed for daily farming decisions.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onNavigate('crops')}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-7 py-3 text-sm font-bold text-white shadow-[0_12px_35px_rgba(16,185,129,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(22,163,74,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Start with crop planning
              </button>
              <button
                type="button"
                onClick={() => onNavigate('price')}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Explore market predictions
              </button>
            </div>
          </div>

          <aside className="rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-lg backdrop-blur-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Platform snapshots</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
                <p className="text-2xl font-black text-emerald-700">100M+</p>
                <p className="mt-1 text-xs text-slate-600">Farmers reached</p>
              </div>
              <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-center">
                <p className="text-2xl font-black text-cyan-700">10+</p>
                <p className="mt-1 text-xs text-slate-600">AI endpoints</p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-center">
                <p className="text-2xl font-black text-amber-700">24/7</p>
                <p className="mt-1 text-xs text-slate-600">Decision support</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Live insight feed</p>
              <div className="mt-3">{renderInsightState()}</div>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">Core tools</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                Fast, focused modules to support planning, prevention, and profitable timing decisions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => (
              <button
                key={feature.page}
                type="button"
                onClick={() => onNavigate(feature.page)}
                className={`group rounded-2xl border bg-gradient-to-br p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${feature.theme}`}
              >
                <span aria-hidden="true" className="text-4xl transition-transform duration-200 group-hover:scale-110">
                  {feature.icon}
                </span>
                <h3 className="mt-4 text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{feature.description}</p>
                <span className="mt-5 inline-flex items-center rounded-lg border border-slate-300 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-emerald-700 transition-colors duration-200 group-hover:bg-white">
                  {feature.cta}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-md backdrop-blur-sm sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">How KrishiAI works</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {howItWorks.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-sm font-black text-white">
                    {index + 1}
                  </p>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-100 to-lime-100 px-6 py-10 shadow-[0_14px_50px_rgba(16,185,129,0.15)] sm:px-10">
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">Ready to plan your next move?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
              Start with one module today and build a smarter, data-supported farming workflow over time.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('crops')}
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-[0_12px_30px_rgba(21,128,61,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              Get started for free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}