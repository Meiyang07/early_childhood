// src/pages/events/EventsEmpty.tsx
import { Plus } from "lucide-react";

export function EventsEmpty({
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
      <h2>{hasFilters ? "No matching events" : "No events yet"}</h2>
      <p>
        {hasFilters
          ? "Try a different search or clear the filters."
          : "Create the first event to get started."}
      </p>
      {hasFilters ? (
        <button type="button" className="btn btn--ghost" onClick={onClear}>
          Clear filters
        </button>
      ) : (
        <button type="button" className="btn btn--primary" onClick={onAdd}>
          <Plus size={16} /> Add event
        </button>
      )}
    </div>
  );
}