import { useEffect } from 'react';

export function useSaleShortcuts(onClear: () => void, onClose: () => void) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'F3') { e.preventDefault(); onClear(); }
      if (e.key === 'F5') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onClear, onClose]);
}