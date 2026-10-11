// src/components/Admissions/AdmissionStates.tsx
import { Inbox, Loader2 } from "lucide-react";

export function AdmissionLoading() {
  return (
    <div className="grid place-items-center rounded-lg border border-border bg-card py-20">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <p className="mt-3 text-sm text-muted-foreground">Loading applications…</p>
    </div>
  );
}

export function AdmissionEmpty({
  onClear,
  hasFilters,
}: {
  onClear: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-border bg-card py-20 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-muted">
        <Inbox className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-base font-semibold">
        {hasFilters ? "No matching applications" : "No applications yet"}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {hasFilters
          ? "Try a different search, status tab or program filter."
          : "New admission applications will appear here."}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}