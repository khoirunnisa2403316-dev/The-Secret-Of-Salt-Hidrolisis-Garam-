import { useState, useEffect, useRef, useCallback } from 'react';
import { TOUR_STEPS, TOUR_STORAGE_KEY } from './tourSteps';
import './OnboardingTour.css';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface ModalPosition {
  top: number;
  left: number;
}

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const [modalPosition, setModalPosition] = useState<ModalPosition>({ top: 100, left: 100 });

  const modalRef = useRef<HTMLDivElement>(null);

  const totalSteps = TOUR_STEPS.length;
  const currentStep = TOUR_STEPS[currentStepIndex];

  // 1. Navigation Handlers defined before effects
  const handleFinish = useCallback(() => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    } catch {}
    setIsOpen(false);
  }, []);

  const handleSkip = useCallback(() => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    } catch {}
    setIsOpen(false);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      }
      handleFinish();
      return prev;
    });
  }, [totalSteps, handleFinish]);

  const handlePrev = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // 2. Initial Auto-Launch on First Visit
  useEffect(() => {
    try {
      const isCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!isCompleted) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          setCurrentStepIndex(0);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage exceptions
    }
  }, []);

  // 3. Custom Event Listener for Re-triggering from Navbar or Buttons
  useEffect(() => {
    const handleOpenTour = () => {
      setCurrentStepIndex(0);
      setIsOpen(true);
    };

    window.addEventListener('open-onboarding-tour', handleOpenTour);
    return () => window.removeEventListener('open-onboarding-tour', handleOpenTour);
  }, []);

  // 4. Update Target Spotlight and Modal Position
  const updatePositions = useCallback(() => {
    if (!isOpen || !currentStep) return;

    const targetEl = document.querySelector(currentStep.target);
    if (!targetEl) {
      // If target is temporarily not in DOM, fallback gracefully to center
      setSpotlightRect(null);
      setModalPosition({
        top: Math.max(20, (window.innerHeight - 380) / 2),
        left: Math.max(16, (window.innerWidth - 440) / 2),
      });
      return;
    }

    const rect = targetEl.getBoundingClientRect();
    const padding = 10;
    const spotTop = Math.max(0, rect.top - padding);
    const spotLeft = Math.max(0, rect.left - padding);
    const spotWidth = rect.width + padding * 2;
    const spotHeight = rect.height + padding * 2;

    setSpotlightRect({
      top: spotTop,
      left: spotLeft,
      width: spotWidth,
      height: spotHeight,
    });

    // Calculate smart modal placement
    const modalEl = modalRef.current;
    const modalWidth = modalEl?.offsetWidth || Math.min(440, window.innerWidth - 32);
    const modalHeight = modalEl?.offsetHeight || 380;

    const isMobile = window.innerWidth <= 640;
    if (isMobile) {
      // Mobile uses bottom sheet CSS positioning
      return;
    }

    // Horizontal centering relative to target, clamped to screen edges
    const idealLeft = spotLeft + (spotWidth / 2) - (modalWidth / 2);
    const clampedLeft = Math.max(16, Math.min(idealLeft, window.innerWidth - modalWidth - 16));

    // Vertical placement
    let idealTop = spotTop + spotHeight + 16; // Default to below target
    const spaceBelow = window.innerHeight - (spotTop + spotHeight + 16);
    const spaceAbove = spotTop - 16;

    if (currentStep.preferredPosition === 'top' && spaceAbove >= modalHeight) {
      idealTop = spotTop - modalHeight - 16;
    } else if (spaceBelow < modalHeight && spaceAbove >= modalHeight) {
      idealTop = spotTop - modalHeight - 16;
    } else if (spaceBelow < modalHeight && spaceAbove < modalHeight) {
      // If both top and bottom are tight, place near bottom or center of screen
      idealTop = Math.max(16, window.innerHeight - modalHeight - 20);
    }

    const clampedTop = Math.max(16, Math.min(idealTop, window.innerHeight - modalHeight - 16));

    setModalPosition({
      top: clampedTop,
      left: clampedLeft,
    });
  }, [isOpen, currentStep]);

  // 5. Scroll smoothly to target when step changes
  useEffect(() => {
    if (!isOpen || !currentStep) return;

    const targetEl = document.querySelector(currentStep.target);
    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }

    // Re-evaluate positions after smooth scroll starts and finishes
    const timer1 = setTimeout(updatePositions, 100);
    const timer2 = setTimeout(updatePositions, 350);
    const timer3 = setTimeout(updatePositions, 650);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, currentStep, updatePositions]);

  // 6. Scroll and Resize Event Listeners
  useEffect(() => {
    if (!isOpen) return;

    let rafId: number;
    const handleScrollOrResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePositions);
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updatePositions]);

  // 7. Keyboard Shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleSkip, handleNext, handlePrev]);

  const isLastStep = currentStepIndex === totalSteps - 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <>
      {/* Standalone Floating Trigger Pill on Home */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setCurrentStepIndex(0);
            setIsOpen(true);
          }}
          className="tour-floating-trigger"
          aria-label="Buka Tur Panduan Fitur Interaktif"
          title="Buka panduan interaktif memahami seluruh fitur website"
        >
          <span style={{ fontSize: '1.15rem' }}>🧭</span>
          <span>Tur Fitur</span>
        </button>
      )}

      {/* Main Tour Overlay */}
      {isOpen && currentStep && (
        <div
          className="tour-overlay-container"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-modal-title"
        >
          {/* Spotlight Cutout Frame */}
          {spotlightRect ? (
            <div
              className="tour-spotlight"
              style={{
                top: `${spotlightRect.top}px`,
                left: `${spotlightRect.left}px`,
                width: `${spotlightRect.width}px`,
                height: `${spotlightRect.height}px`,
              }}
            />
          ) : (
            <div className="tour-backdrop" onClick={handleSkip} />
          )}

          {/* Interactive Modal Pop-up */}
          <div
            ref={modalRef}
            className="tour-modal-card"
            style={{
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left}px`,
            }}
          >
            {/* Header: Step Badge & Close Button */}
            <div className="tour-modal-header">
              <div className="tour-badge-pill">
                <span>📍</span>
                <span>{currentStep.stepBadge}</span>
              </div>
              <button
                type="button"
                onClick={handleSkip}
                className="tour-close-btn"
                aria-label="Tutup dan lewati panduan tur"
                title="Tutup panduan"
              >
                ✕
              </button>
            </div>

            {/* Horizontal Progress Bar */}
            <div
              className="tour-progress-track"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progress panduan ${progressPercent}%`}
            >
              <div
                className="tour-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Title & Icon */}
            <div className="tour-title-wrap">
              <span className="tour-title-icon" aria-hidden="true">
                {currentStep.icon}
              </span>
              <h3 id="tour-modal-title" className="tour-title">
                {currentStep.title}
              </h3>
            </div>

            {/* Short & Comprehensible Description */}
            <p className="tour-description">
              {currentStep.description}
            </p>

            {/* Helpful Tips Box */}
            {currentStep.tip && (
              <div className="tour-tips-box">
                <span className="tour-tips-icon" aria-hidden="true">💡</span>
                <div className="tour-tips-content">
                  <strong>Tips Belajar:</strong>
                  <span>{currentStep.tip}</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="tour-modal-footer">
              <button
                type="button"
                onClick={handleSkip}
                className="tour-btn-skip"
                title="Hentikan tutorial tur fitur"
              >
                Lewati Tur
              </button>

              <div className="tour-nav-controls">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className="tour-btn-prev"
                  title="Menuju langkah sebelumnya"
                >
                  ← Kembali
                </button>

                {isLastStep ? (
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="tour-btn-finish"
                    title="Selesaikan tutorial dan mulai belajar"
                  >
                    <span>Selesaikan Tur</span>
                    <span>✓</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="tour-btn-next"
                    title="Menuju langkah berikutnya"
                  >
                    <span>Lanjut</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
