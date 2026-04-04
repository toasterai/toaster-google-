import { useEffect, useRef, useCallback } from 'react';

export function useModal(isOpen, onClose) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Trap focus and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Focus the first focusable element inside the modal
    setTimeout(() => {
      if (modalRef.current) {
        const first = modalRef.current.querySelector('button, [href], input, select, textarea');
        if (first) first.focus();
      }
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the element that opened the modal
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return { modalRef, handleBackdropClick };
}
