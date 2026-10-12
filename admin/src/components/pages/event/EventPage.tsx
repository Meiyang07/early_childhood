// src/pages/events/EventsPage.tsx
import { useMemo, useState } from "react";
import type { EventRecord, EventStatus, EventWhenFilter } from "@/types/event";

import { Pagination } from "@/components/Common/Pagination";
import { useListEvents } from "@/hook/usePublic";
import { EventsToolbar } from "./EventToolbar";
import { EventsSkeleton } from "./EventSkeleton";
import { EventsEmpty } from "./EventsEmpty";
import { EventCard } from "./EventCard";
import { EventDetailsDialog } from "./EventDetailsDialoug";
import { EventFormDialog } from "./EventFormDialoug";

type StatusFilter = "All" | EventStatus;

export function EventsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [when, setWhen] = useState<EventWhenFilter>("All");
  const [page, setPage] = useState(1);
  const limit = 6;

  // Form modal (add/edit)
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<EventRecord | null>(null);

  // Details modal (view single)
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const params = useMemo(
    () => ({
      search: search.trim() || undefined,
      status,
      when,
      page,
      limit,
    }),
    [search, status, when, page],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useListEvents(params);

  const events = data?.data ?? [];
  const pagination = data?.pagination;
  const hasFilters =
    search.trim() !== "" || status !== "All" || when !== "All";

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(event: EventRecord) {
    setEditing(event);
    setFormOpen(true);
  }

  function openDetails(event: EventRecord) {
    setDetailsId(event._id);
  }

  function goToPage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="reviews-page">
      

      <EventsToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        when={when}
        onWhenChange={(v) => {
          setWhen(v);
          setPage(1);
        }}
        onRefresh={() => refetch()}
        isRefreshing={isFetching && !isLoading}
        onAdd={openCreate}
      />

      {isLoading && <EventsSkeleton count={6} />}

      {isError && (
        <div className="reviews-error" role="alert">
          <p>{error?.message ?? "Failed to load events."}</p>
          <button type="button" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && events.length === 0 && (
        <EventsEmpty
          hasFilters={hasFilters}
          onClear={() => {
            setSearch("");
            setStatus("All");
            setWhen("All");
            setPage(1);
          }}
          onAdd={openCreate}
        />
      )}

      {!isLoading && !isError && events.length > 0 && (
        <>
          <div
            className="grid grid-cols-1 gap-4 transition-opacity md:grid-cols-2 xl:grid-cols-3"
            style={{ opacity: isFetching ? 0.6 : 1 }}
          >
            {events.map((e) => (
              <EventCard
                key={e._id}
                event={e}
                onView={() => openDetails(e)}
                onEdit={() => openEdit(e)}
              />
            ))}
          </div>

          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={goToPage}
              disabled={isFetching}
              windowSize={5}
              showSummary
              className="mt-6"
            />
          )}
        </>
      )}

      {/* Details view — fetches fresh copy from server */}
      <EventDetailsDialog
        eventId={detailsId}
        onClose={() => setDetailsId(null)}
        onEdit={(event) => {
          setDetailsId(null);
          openEdit(event);
        }}
      />

      {/* Add / Edit form */}
      <EventFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        event={editing}
      />
    </div>
  );
}