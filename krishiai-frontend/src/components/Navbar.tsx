import React from 'react';

interface NavbarProps {
  onNavigate: (page: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-xl">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            className="text-3xl font-bold hover:text-green-100 transition"
          >
            🌾 KrishiAI
          </button>
          
          <div className="hidden md:flex space-x-1">
            <button 
              onClick={() => onNavigate('crops')}
              className="px-4 py-2 hover:bg-green-700 rounded transition font-semibold"
            >
              🌱 Crops
            </button>
            <button 
              onClick={() => onNavigate('disease')}
              className="px-4 py-2 hover:bg-green-700 rounded transition font-semibold"
            >
              🦠 Disease
            </button>
            <button 
              onClick={() => onNavigate('price')}
              className="px-4 py-2 hover:bg-green-700 rounded transition font-semibold"
            >
              💹 Prices
            </button>
            <button 
              onClick={() => onNavigate('fertilizer')}
              className="px-4 py-2 hover:bg-green-700 rounded transition font-semibold"
            >
              🧪 Fertilizer
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}