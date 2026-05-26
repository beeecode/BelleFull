import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);
  const frameRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (frameRef.current) return;

      frameRef.current = window.requestAnimationFrame(() => {
        const shouldShow = window.scrollY > 520;

        if (isVisibleRef.current !== shouldShow) {
          isVisibleRef.current = shouldShow;
          setIsVisible(shouldShow);
        }

        frameRef.current = null;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`back-to-top ${isVisible ? 'is-visible' : ''}`}
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
    >
      <ArrowUp size={20} strokeWidth={2.4} />
    </button>
  );
}
