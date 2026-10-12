// src/pages/gallery/GalleryLightbox.tsx
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Pencil, X } from "lucide-react";
import type { Photo } from "@/types/photo";

export function GalleryLightbox({
  photos,
  index,
  onClose,
  onNext,
  onPrev,
  onEdit,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onEdit: (photo: Photo) => void;
}) {
  const photo = photos[index];

  // Keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
    }
    window.addEventListener("keydown", onKey);
    // Lock body scroll while open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onNext, onPrev]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid grid-rows-[auto_1fr_auto] bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between gap-3 p-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{photo.title}</p>
          <p className="truncate text-xs text-white/60">{photo.category}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(photo)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white transition hover:bg-white/20"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="relative flex min-h-0 items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={26} />
          </button>
        )}

        <img
          src={photo.image}
          alt={photo.imageDescription}
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        />

        {/* Next */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={onNext}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight size={26} />
          </button>
        )}
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col gap-2 p-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mx-auto max-w-3xl text-center text-sm text-white/80">
          {photo.imageDescription}
        </p>
        <p className="text-center text-xs tabular-nums text-white/50">
          {index + 1} / {photos.length}
        </p>
      </div>
    </div>
  );
}