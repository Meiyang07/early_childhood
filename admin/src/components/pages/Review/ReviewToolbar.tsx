// src/pages/reviews/ReviewsToolbar.tsx
import { Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Choice } from "@/components/Common/Choice";
import type { TestimonialStatus } from "@/types/testimonial";

type StatusFilter = "All" | TestimonialStatus;

const STATUS_OPTIONS: StatusFilter[] = [
  "All",
  "pending",
  "approved",
  "rejected",
];

export function ReviewsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onRefresh,
  isRefreshing,
  onAdd,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  status: StatusFilter;
  onStatusChange: (v: StatusFilter) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="reviews-toolbar">
      {/* Search */}
      <div className="reviews-search">
        <Search size={18} />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by parent name or review text…"
          aria-label="Search reviews"
        />
      </div>

      {/* Status dropdown */}
      <div className="reviews-status-filter">
        <Choice
          id="reviews-status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(v) => onStatusChange(v as StatusFilter)}
          label="Filter by status"
        />
      </div>

      {/* Refresh */}
      <button
        type="button"
        className="reviews-refresh"
        onClick={onRefresh}
        disabled={isRefreshing}
        aria-label="Refresh reviews"
      >
        <RefreshCw
          size={18}
          className={isRefreshing ? "spin" : undefined}
        />
      </button>

      {/* Add review — inline in the toolbar row */}
      <Button type="button" className="primary-button" onClick={onAdd}>
        <Plus size={18} />
        Add review
      </Button>
    </div>
  );
}