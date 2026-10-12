// src/pages/events/EventCard.tsx
import { useState } from "react";
import {
  Calendar,
  Clock,
  Eye,
  MapPin,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import type { Event } from "@/types/event";
import { useDeleteEvent, useUpdateEvent } from "@/hook/useAdmin";

const statusClass: Record<Event["status"], string> = {
  published: "badge badge--approved",
  draft: "badge badge--pending",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isUpcoming(iso: string) {
  return new Date(iso).getTime() >= Date.now();
}

export function EventCard({
  event,
  onView,
  onEdit,
}: {
  event: Event;
  onView: () => void;
  onEdit: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const removeOne = useDeleteEvent();
  const updateOne = useUpdateEvent();
  const isBusy = removeOne.isPending || updateOne.isPending;

  const upcoming = isUpcoming(event.eventDate);

  function toggleStatus() {
    const next = event.status === "published" ? "draft" : "published";
    updateOne.mutate({ id: event._id, payload: { status: next } });
  }

  function handleDelete() {
    removeOne.mutate(event._id, {
      onSettled: () => setConfirmDelete(false),
    });
  }

  return (
    <article className="flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="line-clamp-2 text-base font-semibold">{event.title}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar size={13} />
              {formatDate(event.eventDate)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={13} />
              {event.time}
            </span>
          </div>
        </div>
        <span className={statusClass[event.status]}>{event.status}</span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin size={13} />
        <span className="truncate">{event.location}</span>
      </div>

      {/* Details preview */}
      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {event.details}
      </p>

      {/* Date badge */}
      {upcoming && event.status === "published" && (
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
          Upcoming
        </span>
      )}

      {/* Actions */}
      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <button
          type="button"
          onClick={onView}
          disabled={isBusy}
          className="btn btn--ghost"
          aria-label="View details"
        >
          <Eye size={14} /> View
        </button>

        <button
          type="button"
          onClick={toggleStatus}
          disabled={isBusy}
          className="btn btn--ghost text-xs"
        >
          {event.status === "published" ? "Unpublish" : "Publish"}
        </button>

        <button
          type="button"
          onClick={onEdit}
          disabled={isBusy}
          className="btn btn--ghost"
          aria-label="Edit"
        >
          <Pencil size={14} />
        </button>

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={isBusy}
            className="btn btn--danger ml-auto"
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </button>
        ) : (
          <div className="ml-auto inline-flex items-center gap-1 text-xs">
            <span>Delete?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isBusy}
              className="btn btn--danger"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              disabled={isBusy}
              className="btn btn--ghost"
              aria-label="Cancel delete"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}