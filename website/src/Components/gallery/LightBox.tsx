import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { asset } from '@/lib/utils';
import type { GalleryItem } from '@/types';
import { Icon } from '../Common';

interface LightboxProps {
  item: GalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  index: number;
  total: number;
}

export function Lightbox({ item, onClose, onPrev, onNext, index, total }: LightboxProps) {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onPrev();
      if (event.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, onPrev, onNext]);

  const dialog = (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-[#0b0f18]/95 backdrop-blur-md"
      role="presentation"
      onClick={onClose}
    >
      {/* ── Top toolbar ── */}
      <div
        className="relative z-10 flex shrink-0 items-center justify-between px-4 py-3 text-white sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wider text-white/90 backdrop-blur sm:text-sm">
          {index + 1} / {total}
        </span>

        <button
          type="button"
          aria-label="Close photo"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 active:scale-95 sm:h-11 sm:w-11"
        >
          <Icon name="close" size={22} />
        </button>
      </div>

      {/* ── Stage (image + nav) ── */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16 md:px-24"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev */}
        <button
          type="button"
          aria-label="Previous photo"
          onClick={onPrev}
          className="absolute left-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 active:scale-95 sm:left-4 sm:h-14 sm:w-14"
        >
          <span className="text-2xl">←</span>
        </button>

        {/* Image */}
        <img
          key={item.image}
          src={asset(item.image)}
          alt={item.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full animate-[photo-enter_0.35s_ease_both] select-none rounded-lg object-contain shadow-2xl"
          draggable={false}
        />

        {/* Next */}
        <button
          type="button"
          aria-label="Next photo"
          onClick={onNext}
          className="absolute right-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 active:scale-95 sm:right-4 sm:h-14 sm:w-14"
        >
          <span className="text-2xl">→</span>
        </button>
      </div>

      {/* ── Bottom caption ── */}
      <div
        className="shrink-0 px-4 pb-5 pt-3 text-center sm:px-6 sm:pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mx-auto max-w-2xl text-sm font-medium text-white/90 sm:text-base">
          {item.alt}
        </p>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(dialog, document.body)
    : null;
}