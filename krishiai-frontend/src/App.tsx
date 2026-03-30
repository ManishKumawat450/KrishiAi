import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CropRecommendation from './pages/CropRecommendation';
import DiseaseDetection from './pages/DiseaseDetection';
import PricePrediction from './pages/PricePrediction';
import FertilizerGuide from './pages/FertilizerGuide';
import Chat from './pages/Chat';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const currentContent = useMemo(() => {
    if (!currentPage) {
      return { type: 'empty' as const, node: null };
    }

    if (currentPage === 'home') {
      return { type: 'ready' as const, node: <Home onNavigate={setCurrentPage} /> };
    }
    if (currentPage === 'crops') {
      return { type: 'ready' as const, node: <CropRecommendation /> };
    }
    if (currentPage === 'disease') {
      return { type: 'ready' as const, node: <DiseaseDetection /> };
    }
    if (currentPage === 'price') {
      return { type: 'ready' as const, node: <PricePrediction /> };
    }
    if (currentPage === 'fertilizer') {
      return { type: 'ready' as const, node: <FertilizerGuide /> };
    }
    if (currentPage === 'chat') {
      return { type: 'ready' as const, node: <Chat /> };
    }

    return { type: 'error' as const, node: null };
  }, [currentPage]);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const transitionTimer = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 180);

    return () => {
      window.clearTimeout(transitionTimer);
    };
  }, [currentPage]);

  return (
    <div className="app-shell">
      <Navbar onNavigate={setCurrentPage} />

      <main className="app-main" aria-live="polite" aria-busy={isTransitioning}>
        {isTransitioning && (
          <section className="app-status-card" role="status" aria-label="Loading page">
            <span className="app-spinner" aria-hidden="true" />
            <div>
              <h2>Loading experience...</h2>
              <p>Preparing insights for your next farming decision.</p>
            </div>
          </section>
        )}

        {!isTransitioning && currentContent.type === 'ready' && (
          <section className="app-page-enter">{currentContent.node}</section>
        )}

        {!isTransitioning && currentContent.type === 'empty' && (
          <section className="app-status-card" role="status" aria-label="No page selected">
            <div>
              <h2>Nothing selected yet</h2>
              <p>Select a section from the navigation to get started.</p>
            </div>
            <button type="button" className="app-cta" onClick={() => setCurrentPage('home')}>
              Open Home
            </button>
          </section>
        )}

        {!isTransitioning && currentContent.type === 'error' && (
          <section className="app-status-card app-status-error" role="alert" aria-label="Page not found">
            <div>
              <h2>Oops, this page is unavailable</h2>
              <p>The selected route is not valid. Return to home to continue.</p>
            </div>
            <button type="button" className="app-cta" onClick={() => setCurrentPage('home')}>
              Back to Home
            </button>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
