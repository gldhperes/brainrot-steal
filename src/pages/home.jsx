import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import brainrots from '../settings/brainrots';



export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(null);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % brainrots.length);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating]);

  const goToPrev = useCallback(() => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + brainrots.length) % brainrots.length);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch/Swipe support
  const [touchStart, setTouchStart] = useState(null);
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goToNext() : goToPrev();
    }
    setTouchStart(null);
  };

  const currentBrainrot = brainrots[currentIndex];

  return (
    <>
      <style>{`
       
      `}</style>

      <div className="container">
        {/* Main Layout with Ads */}
        <div className="layout-wrapper">

          {/* Main Content */}
          <main
            className="main-content"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <header className="header">
              <h1 className="title">BRAINROT</h1>

            </header>

            {/* Carousel */}
            <div className="carousel-container">
              {/* Prev Button */}
              <button
                onClick={goToPrev}
                className="nav-button"
                aria-label="Anterior"
              >
                <ChevronLeft style={{ width: '20px', height: '20px', color: 'white' }} />
              </button>

              {/* Image Container */}
              <div className="image-container">
                <div
                  className={`image-wrapper ${isAnimating
                    ? direction === 'right' ? 'slide-exit-right' : 'slide-exit-left'
                    : direction === 'right' ? 'slide-enter-right' : direction === 'left' ? 'slide-enter-left' : ''
                    }`}
                >
                  <img
                    src={currentBrainrot.image}
                    alt={`${currentBrainrot.name}`}
                    // loading="lazy"
                  />
                  <div className="image-overlay" />
                </div>

                {/* Floating Elements */}
                <div className="float-circle top-right" />
                <div className="float-circle bottom-left" />
              </div>

              {/* Next Button */}
              <button
                onClick={goToNext}
                className="nav-button"
                aria-label="Próximo"
              >
                <ChevronRight style={{ width: '20px', height: '20px', color: 'white' }} />
              </button>
            </div>

            {/* Brainrot Info */}
            <div className="info-section">
              <h2 className="info-title">{currentBrainrot.name}</h2>
              <p className="info-description">{currentBrainrot.description}</p>
            </div>

            {/* Dots Indicator */}
            <div className="dots-container" role="tablist" aria-label="Navegação do carrossel">
              {brainrots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (index !== currentIndex && !isAnimating) {
                      setDirection(index > currentIndex ? 'right' : 'left');
                      setIsAnimating(true);
                      setTimeout(() => {
                        setCurrentIndex(index);
                        setIsAnimating(false);
                      }, 300);
                    }
                  }}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Ir para ${brainrots[index].name}`}
                />
              ))}
            </div>

            {/* Counter */}
            <p className="counter">
              {currentIndex + 1} / {brainrots.length}
            </p>

            {/* Instructions */}
            <p className="instructions desktop">
              Use the arrows ← → or swipe to navigate
            </p>
            <p className="instructions mobile">
              Deslize para navegar
            </p>
          </main>

        </div>

        {/* Footer */}
        <footer>

          {/* Credits */}
          <div className="credits">
            <p className="credits-text">
              Made with 💜 by{' '}
              <a
                href="https://guilhermeperes.com.br" target='_blank'
                className="credits-link"
              >
                Guilherme Peres
              </a>
            </p>

          </div>
        </footer>
      </div>
    </>
  );
}