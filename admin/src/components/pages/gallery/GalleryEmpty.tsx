// src/pages/gallery/GalleryEmpty.tsx
import { Plus } from "lucide-react";

export function GalleryEmpty({
  hasFilters,
  onClear,
  onAdd,
}: {
  hasFilters: boolean;
  onClear: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="reviews-empty">
      <h2>{hasFilters ? "No matching photos" : "No photos yet"}</h2>
      <p>
        {hasFilters
          ? "Try a different search or clear the filters."
          : "Upload the first photo to get started."}
      </p>
      {hasFilters ? (
        <button type="button" className="btn btn--ghost" onClick={onClear}>
          Clear filters
        </button>
      ) : (
        <button type="button" className="btn btn--primary" onClick={onAdd}>
          <Plus size={16} /> Add photo
        </button>
      )}
    </div>
  );
}