// src/pages/gallery/GalleryToolbar.tsx
import { Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Choice } from "@/components/Common/Choice";
import type { PhotoCategory, PhotoStatus } from "@/types/photo";

type CategoryFilter = "All" | PhotoCategory;
type StatusFilter = "All" | PhotoStatus;

const CATEGORY_OPTIONS: CategoryFilter[] = [
  "All",
  "classroom",
  "activities",
  "outdoors",
  "graduation",
];

const STATUS_OPTIONS: StatusFilter[] = ["All", "published", "draft"];

export function GalleryToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  onRefresh,
  isRefreshing,
  onAdd,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  category: CategoryFilter;
  onCategoryChange: (v: CategoryFilter) => void;
  status: StatusFilter;
  onStatusChange: (v: StatusFilter) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex min-w-[16rem] flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
        <Search size={18} className="text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or description…"
          aria-label="Search photos"
          className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="min-w-[10rem]">
        <Choice
          id="gallery-category-filter"
          value={category}
          options={CATEGORY_OPTIONS}
          onChange={(v) => onCategoryChange(v as CategoryFilter)}
          label="Filter by category"
        />
      </div>

      <div className="min-w-[9rem]">
        <Choice
          id="gallery-status-filter"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(v) => onStatusChange(v as StatusFilter)}
          label="Filter by status"
        />
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        aria-label="Refresh photos"
        className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background transition-colors hover:bg-accent disabled:opacity-50"
      >
        <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
      </button>

      <Button type="button" className="primary-button" onClick={onAdd}>
        <Plus size={18} />
        Add photo
      </Button>
    </div>
  );
}