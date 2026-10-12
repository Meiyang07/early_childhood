// src/pages/reviews/ReviewEmpty.tsx
import { Plus } from "lucide-react";

export function ReviewsEmpty({
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
      <h2>{hasFilters ? "No matching reviews" : "No reviews yet"}</h2>
      <p>
        {hasFilters
          ? "Try a different search or clear the filters."
          : "Reviews submitted by parents will appear here. You can also add one manually."}
      </p>
      {hasFilters ? (
        <button type="button" className="btn btn--ghost" onClick={onClear}>
          Clear filters
        </button>
      ) : (
        <button type="button" className="btn btn--primary" onClick={onAdd}>
          <Plus size={16} /> Add review
        </button>
      )}
    </div>
  );
}