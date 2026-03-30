import React, { useState } from 'react';

interface NavbarProps {
  onNavigate: (page: string) => void;
}

const navItems = [
  { label: 'Crops', icon: '🌱', page: 'crops' },
  { label: 'Disease', icon: '🦠', page: 'disease' },
  { label: 'Prices', icon: '💹', page: 'price' },
  { label: 'Fertilizer', icon: '🧪', page: 'fertilizer' },
];

export default function Navbar({ onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuId = 'main-navigation-mobile';

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-100 bg-white/85 shadow-[0_8px_28px_rgba(22,101,52,0.08)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onNavigate('home');
              setIsOpen(false);
            }}
            className="group inline-flex items-center gap-2 rounded-lg px-1 py-1 text-left transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Go to home page"
          >
            <span aria-hidden="true" className="text-2xl sm:text-3xl">🌾</span>
            <span className="bg-gradient-to-r from-emerald-700 via-green-700 to-lime-700 bg-clip-text text-xl font-black tracking-tight text-transparent sm:text-2xl">
              KrishiAI
            </span>
            <span className="sr-only">Home</span>
          </button>

          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => {
                  onNavigate(item.page);
                  setIsOpen(false);
                }}
                className="group inline-flex items-center gap-2 rounded-xl border border-transparent px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2 text-xl text-slate-700 transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls={mobileMenuId}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        <div
          id={mobileMenuId}
          className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
            isOpen ? 'max-h-80 opacity-100 pt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-2 border-t border-slate-200">
            {navItems.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => {
                  onNavigate(item.page);
                  setIsOpen(false);
                }}
                className="mt-2 flex w-full items-center gap-2 rounded-xl border border-transparent px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}