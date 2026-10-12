// src/pages/programs/ProgramsToolbar.tsx
import { Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Choice } from "@/components/Common/Choice";
import type { ProgramStatus } from "@/types/program";

type StatusFilter = "All" | ProgramStatus;

const STATUS_OPTIONS: StatusFilter[] = ["All", "published", "draft"];

export function ProgramsToolbar({
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
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex min-w-[16rem] flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
        <Search size={18} className="text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or description…"
          aria-label="Search programs"
          className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="min-w-[10rem]">
        <Choice
          id="programs-status-filter"
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
        aria-label="Refresh programs"
        className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background transition-colors hover:bg-accent disabled:opacity-50"
      >
        <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
      </button>

      <Button type="button" className="primary-button" onClick={onAdd}>
        <Plus size={18} />
        Add program
      </Button>
    </div>
  );
}