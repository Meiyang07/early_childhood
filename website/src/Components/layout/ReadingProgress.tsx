import { useScrollProgress } from '@/hooks/useScrollProgress';

export function ReadingProgress() {
  const progress = useScrollProgress();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
      aria-hidden="true"
    >
      <span
        className="block h-full origin-left bg-[linear-gradient(90deg,#e85d26,#df83c7,#283c82)] transition-transform duration-100"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}