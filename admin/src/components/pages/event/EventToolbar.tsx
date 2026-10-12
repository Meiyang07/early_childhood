// src/pages/events/EventsToolbar.tsx
import { Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Choice } from "@/components/Common/Choice";
import type { EventStatus, EventWhenFilter } from "@/types/event";

type StatusFilter = "All" | EventStatus;

const STATUS_OPTIONS: StatusFilter[] = ["All", "published", "draft"];
const WHEN_OPTIONS: EventWhenFilter[] = ["All", "upcoming", "past"];

export function EventsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  when,
  onWhenChange,
  onRefresh,
  isRefreshing,
  onAdd,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  status: StatusFilter;
  onStatusChange: (v: StatusFilter) => void;
  when: EventWhenFilter;
  onWhenChange: (v: EventWhenFilter) => void;
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
          placeholder="Search by title, location, or details…"
          aria-label="Search events"
          className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="min-w-[9rem]">
        <Choice
          id="events-status-filter"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(v) => onStatusChange(v as StatusFilter)}
          label="Filter by status"
        />
      </div>

      <div className="min-w-[9rem]">
        <Choice
          id="events-when-filter"
          value={when}
          options={WHEN_OPTIONS}
          onChange={(v) => onWhenChange(v as EventWhenFilter)}
          label="Filter by date"
        />
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        aria-label="Refresh events"
        className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background transition-colors hover:bg-accent disabled:opacity-50"
      >
        <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
      </button>

      <Button type="button" className="primary-button" onClick={onAdd}>
        <Plus size={18} />
        Add event
      </Button>
    </div>
  );
}