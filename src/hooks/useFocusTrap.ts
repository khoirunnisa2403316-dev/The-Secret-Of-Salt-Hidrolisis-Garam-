import { useEffect, useRef } from 'react';

export interface UseFocusTrapOptions {
  isOpen: boolean;
  onClose?: () => void;
  initialFocusSelector?: string;
  restoreFocus?: boolean;
}

const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'area[href]:not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'iframe:not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]:not([tabindex="-1"])',
].join(', ');

function isElementVisible(element: HTMLElement): boolean {
  return (
    element.offsetWidth > 0 ||
    element.offsetHeight > 0 ||
    element.getClientRects().length > 0
  );
}

/**
 * Custom hook to enforce W3C ARIA Dialog modal focus management:
 * 1. Automatically sets initial focus within the modal upon opening.
 * 2. Traps Tab and Shift+Tab navigation strictly inside the modal container.
 * 3. Handles Escape key to close the modal.
 * 4. Restores focus back to the triggering element upon modal close.
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>({
  isOpen,
  onClose,
  initialFocusSelector,
  restoreFocus = true,
}: UseFocusTrapOptions) {
  const containerRef = useRef<T | null>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Manage trigger element capturing and focus restoration on open/close
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = (document.activeElement as HTMLElement) || null;
    } else if (triggerElementRef.current) {
      if (restoreFocus && typeof triggerElementRef.current.focus === 'function') {
        const elementToRestore = triggerElementRef.current;
        setTimeout(() => {
          elementToRestore.focus();
        }, 15);
      }
      triggerElementRef.current = null;
    }
  }, [isOpen, restoreFocus]);

  // Clean up focus on unmount if modal was open
  useEffect(() => {
    return () => {
      if (restoreFocus && triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
        triggerElementRef.current.focus();
      }
    };
  }, [restoreFocus]);

  // Manage initial focus & keyboard focus trap (Tab, Shift+Tab, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const getFocusableElements = (): HTMLElement[] => {
      if (!containerRef.current) return [];
      const nodes = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );
      return nodes.filter(
        (node) =>
          !node.hasAttribute('disabled') &&
          node.getAttribute('aria-hidden') !== 'true' &&
          isElementVisible(node)
      );
    };

    // 1. Move initial focus inside modal container
    const initialFocusTimer = setTimeout(() => {
      if (!containerRef.current) return;
      const focusables = getFocusableElements();

      let target: HTMLElement | null = null;
      if (initialFocusSelector) {
        target = containerRef.current.querySelector<HTMLElement>(initialFocusSelector);
      }

      if (!target && focusables.length > 0) {
        target = focusables[0];
      }

      if (!target) {
        target = containerRef.current;
      }

      if (target && typeof target.focus === 'function') {
        target.focus();
      }
    }, 20);

    // 2. Focus trap and Escape key listener
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (onCloseRef.current) {
          event.preventDefault();
          event.stopPropagation();
          onCloseRef.current();
        }
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = getFocusableElements();
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        // Shift + Tab: Move backwards
        if (activeElement === firstElement || !containerRef.current?.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: Move forwards
        if (activeElement === lastElement || !containerRef.current?.contains(activeElement)) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      clearTimeout(initialFocusTimer);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, initialFocusSelector]);

  return containerRef;
}

export default useFocusTrap;
