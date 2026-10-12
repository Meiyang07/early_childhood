// src/pages/events/EventFormDialog.tsx
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Choice } from "@/components/Common/Choice";
import { useCreateEvent, useUpdateEvent } from "@/hook/useAdmin";
import type {
  CreateEventPayload,
  Event,
  EventStatus,
} from "@/types/event";

type Props = {
  open: boolean;
  onClose: () => void;
  event?: Event | null;
};

const STATUSES: EventStatus[] = ["draft", "published"];
const MAX_DETAILS = 3000;

type FormState = {
  title: string;
  eventDate: string; // "YYYY-MM-DD"
  time: string;
  location: string;
  details: string;
  status: EventStatus;
};

const empty: FormState = {
  title: "",
  eventDate: new Date().toISOString().slice(0, 10),
  time: "",
  location: "",
  details: "",
  status: "draft",
};

/** Convert ISO string to "YYYY-MM-DD" for <input type="date" /> */
function toDateInput(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function EventFormDialog({ open, onClose, event }: Props) {
  const isEdit = !!event;
  const createOne = useCreateEvent();
  const updateOne = useUpdateEvent();
  const isSubmitting = createOne.isPending || updateOne.isPending;

  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    if (event) {
      setForm({
        title: event.title,
        eventDate: toDateInput(event.eventDate),
        time: event.time,
        location: event.location,
        details: event.details,
        status: event.status,
      });
    } else {
      setForm(empty);
    }
  }, [open, event]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (error) setError("");
  }

  function validate(): string | null {
    if (form.title.trim().length < 2)
      return "Title must be at least 2 characters.";
    if (form.title.trim().length > 150)
      return "Title cannot exceed 150 characters.";
    if (!form.eventDate) return "Event date is required.";
    if (form.time.trim().length < 1) return "Time is required.";
    if (form.location.trim().length < 2)
      return "Location must be at least 2 characters.";
    if (form.location.trim().length > 250)
      return "Location cannot exceed 250 characters.";
    if (form.details.trim().length < 10)
      return "Details must be at least 10 characters.";
    if (form.details.trim().length > MAX_DETAILS)
      return `Details cannot exceed ${MAX_DETAILS} characters.`;
    return null;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const localError = validate();
    if (localError) {
      setError(localError);
      return;
    }

    // Send eventDate as full ISO string so the backend stores UTC midnight correctly
    const payload: CreateEventPayload = {
      title: form.title.trim(),
      eventDate: new Date(`${form.eventDate}T00:00:00.000Z`).toISOString(),
      time: form.time.trim(),
      location: form.location.trim(),
      details: form.details.trim(),
      status: form.status,
    };

    if (isEdit && event) {
      updateOne.mutate(
        { id: event._id, payload },
        { onSuccess: () => onClose() },
      );
    } else {
      createOne.mutate(payload, { onSuccess: () => onClose() });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o && !isSubmitting) onClose();
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit event" : "Add event"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this event's details."
              : "Create a new event. Save as draft or publish immediately."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="ev-title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="ev-title"
              autoFocus
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Annual Sports Day"
              maxLength={150}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="ev-date" className="text-sm font-medium">
                Date <span className="text-destructive">*</span>
              </label>
              <Input
                id="ev-date"
                type="date"
                value={form.eventDate}
                onChange={(e) => set("eventDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ev-time" className="text-sm font-medium">
                Time <span className="text-destructive">*</span>
              </label>
              <Input
                id="ev-time"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                placeholder="e.g. 9:00 AM - 1:00 PM"
                maxLength={100}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="ev-loc" className="text-sm font-medium">
              Location <span className="text-destructive">*</span>
            </label>
            <Input
              id="ev-loc"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Main School Ground, Kathmandu"
              maxLength={250}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="ev-details" className="text-sm font-medium">
              Details <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="ev-details"
              value={form.details}
              onChange={(e) => set("details", e.target.value)}
              placeholder="Describe the event…"
              rows={6}
              maxLength={MAX_DETAILS}
              required
            />
            <p className="text-right text-xs text-muted-foreground">
              {form.details.length}/{MAX_DETAILS}
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="ev-status" className="text-sm font-medium">
              Status
            </label>
            <Choice
              id="ev-status"
              value={form.status}
              options={STATUSES}
              onChange={(v) => set("status", v as EventStatus)}
              label="Status"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Save changes" : "Create event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}