import { useEffect, useState } from 'react';

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    function update(): void {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const length = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(length > 0 ? Math.max(0, Math.min(1, window.scrollY / length)) : 0);
      });
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}