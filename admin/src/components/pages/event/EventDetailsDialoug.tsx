// src/pages/events/EventDetailsDialog.tsx
import { Calendar, Clock, MapPin, Pencil, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEventById } from "@/hook/usePublic";
import type { EventRecord } from "@/types/event";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

const statusClass: Record<EventRecord["status"], string> = {
    published: "badge badge--approved",
    draft: "badge badge--pending",
};

export function EventDetailsDialog({
    eventId,
    onClose,
    onEdit,
}: {
    eventId: string | null;
    onClose: () => void;
    onEdit: (event: EventRecord) => void;
}) {

  
    const open = !!eventId;
    const { data:event, isLoading, isError, error } = useEventById(
        eventId ?? undefined,
    );

  
  

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="pr-8">{event?.title ?? "Event"}</DialogTitle>
                    <DialogDescription>
                        {event ? "Event details" : "Loading…"}
                    </DialogDescription>
                </DialogHeader>

                {isLoading && (
                    <div className="space-y-3 py-4">
                        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                        <div className="h-20 w-full animate-pulse rounded bg-muted" />
                    </div>
                )}

                {isError && (
                    <p className="text-sm text-destructive">
                        {error?.message ?? "Failed to load event"}
                    </p>
                )}

                {event && (
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar size={14} /> {formatDate(event.eventDate)}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Clock size={14} /> {event.time}
                            </span>
                            <span className={statusClass[event.status]}>{event.status}</span>
                        </div>

                        <div className="flex items-start gap-2 text-sm">
                            <MapPin size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                            <span>{event.location}</span>
                        </div>

                        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                            {event.details}
                        </p>

                        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                            <span>
                                Created {new Date(event.createdAt).toLocaleDateString()}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(event)}
                            >
                                <Pencil size={14} /> Edit
                            </Button>
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
                >
                    <X size={16} />
                </button>
            </DialogContent>
        </Dialog>
    );
}