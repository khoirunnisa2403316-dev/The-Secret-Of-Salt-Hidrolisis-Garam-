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

  // 4. Update Target Spotlight and Modal Position with Smart Placement
  const updatePositions = useCallback(() => {
    if (!isOpen || !currentStep) return;

    const isMobile = window.innerWidth <= 768;
    const targetSelector =
      isMobile && currentStep.mobileTarget
        ? currentStep.mobileTarget
        : currentStep.target;

    const targetEl = document.querySelector(targetSelector);
    if (!targetEl) {
      setSpotlightRect(null);
      const modalW = isMobile ? Math.min(340, window.innerWidth - 24) : 380;
      const modalH = isMobile ? 260 : 300;
      setModalPosition({
        top: Math.max(16, (window.innerHeight - modalH) / 2),
        left: Math.max(12, (window.innerWidth - modalW) / 2),
      });
      return;
    }

    const rect = targetEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      setSpotlightRect(null);
      const modalW = isMobile ? Math.min(340, window.innerWidth - 24) : 380;
      const modalH = isMobile ? 260 : 300;
      setModalPosition({
        top: Math.max(16, (window.innerHeight - modalH) / 2),
        left: Math.max(12, (window.innerWidth - modalW) / 2),
      });
      return;
    }

    const padding = isMobile ? 6 : 8;
    const spotTop = Math.max(0, rect.top - padding);
    const spotLeft = Math.max(0, rect.left - padding);
    const spotWidth = Math.min(window.innerWidth - spotLeft, rect.width + padding * 2);
    const spotHeight = rect.height + padding * 2;

    setSpotlightRect({
      top: spotTop,
      left: spotLeft,
      width: spotWidth,
      height: spotHeight,
    });

    const modalEl = modalRef.current;
    const modalWidth = modalEl?.offsetWidth || (isMobile ? Math.min(340, window.innerWidth - 24) : 380);
    const modalHeight = modalEl?.offsetHeight || (isMobile ? 260 : 300);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Available vertical clearances
    const spaceAbove = spotTop - 12;
    const spaceBelow = viewportHeight - (spotTop + spotHeight + 12);

    let idealTop: number;

    // 1. Determine ideal vertical placement based on preferredPosition and space
    if (currentStep.preferredPosition === 'bottom') {
      if (spaceBelow >= modalHeight) {
        idealTop = spotTop + spotHeight + 10;
      } else if (spaceAbove >= modalHeight) {
        idealTop = spotTop - modalHeight - 10;
      } else {
        idealTop = spaceBelow >= spaceAbove ? viewportHeight - modalHeight - 12 : 12;
      }
    } else if (currentStep.preferredPosition === 'top') {
      if (spaceAbove >= modalHeight) {
        idealTop = spotTop - modalHeight - 10;
      } else if (spaceBelow >= modalHeight) {
        idealTop = spotTop + spotHeight + 10;
      } else {
        idealTop = spaceAbove >= spaceBelow ? 12 : viewportHeight - modalHeight - 12;
      }
    } else {
      // Default: below if space permits, otherwise above
      if (spaceBelow >= modalHeight) {
        idealTop = spotTop + spotHeight + 10;
      } else if (spaceAbove >= modalHeight) {
        idealTop = spotTop - modalHeight - 10;
      } else {
        idealTop = spaceBelow >= spaceAbove ? viewportHeight - modalHeight - 12 : 12;
      }
    }

    // 2. Strict Anti-Collision Check: Ensure modal never obscures spotlight
    const isOverlapping = idealTop < (spotTop + spotHeight) && (idealTop + modalHeight) > spotTop;
    if (isOverlapping) {
      if (spaceBelow >= modalHeight) {
        idealTop = spotTop + spotHeight + 8;
      } else if (spaceAbove >= modalHeight) {
        idealTop = spotTop - modalHeight - 8;
      } else if (!isMobile) {
        const spaceRight = viewportWidth - (spotLeft + spotWidth + 16);
        const spaceLeft = spotLeft - 16;
        if (spaceRight >= modalWidth) {
          idealTop = Math.max(12, Math.min(spotTop, viewportHeight - modalHeight - 12));
        } else if (spaceLeft >= modalWidth) {
          idealTop = Math.max(12, Math.min(spotTop, viewportHeight - modalHeight - 12));
        }
      } else {
        idealTop = spaceBelow >= spaceAbove ? viewportHeight - modalHeight - 10 : 10;
      }
    }

    // 3. Horizontal Alignment
    let clampedLeft: number;
    if (isMobile) {
      clampedLeft = Math.max(12, (viewportWidth - modalWidth) / 2);
    } else {
      const idealLeft = spotLeft + (spotWidth / 2) - (modalWidth / 2);
      clampedLeft = Math.max(16, Math.min(idealLeft, viewportWidth - modalWidth - 16));
    }

    const clampedTop = Math.max(10, Math.min(idealTop, viewportHeight - modalHeight - 10));

    setModalPosition({
      top: clampedTop,
      left: clampedLeft,
    });
  }, [isOpen, currentStep]);

  // 5. Scroll smoothly to target with viewport offsets
  useEffect(() => {
    if (!isOpen || !currentStep) return;

    const isMobile = window.innerWidth <= 768;
    const targetSelector =
      isMobile && currentStep.mobileTarget
        ? currentStep.mobileTarget
        : currentStep.target;

    const targetEl = document.querySelector(targetSelector);
    if (targetEl) {
      const elemRect = targetEl.getBoundingClientRect();
      const currentScrollY = window.scrollY || window.pageYOffset;
      const elemTopAbs = elemRect.top + currentScrollY;
      const elemHeight = elemRect.height;
      const viewportHeight = window.innerHeight;

      let targetScrollY: number;

      if (currentStep.preferredPosition === 'top') {
        const bottomOffset = isMobile ? Math.min(viewportHeight - elemHeight - 20, 360) : 320;
        targetScrollY = Math.max(0, elemTopAbs - bottomOffset);
      } else {
        const topOffset = isMobile ? 70 : 85;
        targetScrollY = Math.max(0, elemTopAbs - topOffset);
      }

      window.scrollTo({
        top: targetScrollY,
        left: 0,
        behavior: 'smooth',
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

          {/* Interactive Modal Pop-up with Smart Positioning */}
          <div
            ref={modalRef}
            className="tour-modal-card"
            style={{
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left}px`,
            }}
          >
            {/* Header: Title + Close Button, Step Label, and 7-Segment Progress Bar */}
            <div className="tour-modal-header">
              {/* Top Row: Title and Close (X) */}
              <div className="tour-header-title-bar">
                <div className="tour-title-wrap">
                  <span className="tour-title-icon" aria-hidden="true">
                    {currentStep.icon}
                  </span>
                  <h3 id="tour-modal-title" className="tour-title">
                    {currentStep.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="tour-close-btn"
                  aria-label="Tutup dan lewati panduan tur"
                  title="Tutup panduan (Esc)"
                >
                  ✕
                </button>
              </div>

              {/* Step Label: Tur Fitur • Langkah X dari 7 */}
              <div className="tour-step-label-row">
                <span className="tour-badge-pill">
                  Tur Fitur • Langkah {currentStepIndex + 1} dari {totalSteps}
                </span>
              </div>

              {/* 7-Segment Horizontal Progress Bar */}
              <div
                className="tour-segments-track"
                role="progressbar"
                aria-valuenow={currentStepIndex + 1}
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                aria-label={`Langkah ${currentStepIndex + 1} dari ${totalSteps}`}
              >
                {TOUR_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`tour-segment-bar ${
                      idx === currentStepIndex
                        ? 'active'
                        : idx < currentStepIndex
                        ? 'completed'
                        : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Scrollable Body Content (Only this part scrolls if height is constrained) */}
            <div className="tour-modal-body">
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
            </div>

            {/* Sticky / Pinned Footer: Navigation Buttons */}
            <div className="tour-modal-footer">
              <div className="tour-nav-row">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className="tour-btn-prev"
                  title="Menuju langkah sebelumnya"
                >
                  ← Sebelumnya
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
                    <span>Selanjutnya</span>
                    <span>→</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleSkip}
                className="tour-btn-skip-bottom"
                title="Hentikan tutorial tur fitur"
              >
                Lewati Tur
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
