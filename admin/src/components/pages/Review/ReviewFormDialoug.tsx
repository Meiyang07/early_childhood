// src/pages/reviews/ReviewFormDialog.tsx
import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Star } from "lucide-react";
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
import {
  useCreateTestimonial,
  useUpdateTestimonial,
} from "@/hook/useAdmin";
import type {
  CreateTestimonialPayload,
  Testimonial,
} from "@/types/testimonial";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Pass a testimonial to edit, or null to create */
  testimonial?: Testimonial | null;
};

const RELATIONSHIPS = ["Father", "Mother", "Guardian", "Other"] as const;
type Relationship = (typeof RELATIONSHIPS)[number];

type FormState = {
  parentName: string;
  relationship: Relationship;
  testimonial: string;
  rating: number;
  consentToPublish: boolean;
};

const emptyForm: FormState = {
  parentName: "",
  relationship: "Father",
  testimonial: "",
  rating: 5,
  consentToPublish: true,
};

const MAX_TESTIMONIAL = 1500;

export function ReviewFormDialog({ open, onClose, testimonial }: Props) {
  const isEdit = !!testimonial;
  const createOne = useCreateTestimonial();
  const updateOne = useUpdateTestimonial();
  const isSubmitting = createOne.isPending || updateOne.isPending;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");

  // Reset whenever the dialog opens or target changes
  useEffect(() => {
    if (!open) return;
    setError("");
    if (testimonial) {
      setForm({
        parentName: testimonial.parentName,
        relationship: testimonial.relationship as Relationship,
        testimonial: testimonial.testimonial,
        rating: testimonial.rating,
        consentToPublish: testimonial.consentToPublish,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, testimonial]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (error) setError("");
  }

  function validate(): string | null {
    if (form.parentName.trim().length < 2)
      return "Parent name must be at least 2 characters.";
    if (form.parentName.trim().length > 100)
      return "Parent name cannot exceed 100 characters.";
    if (form.testimonial.trim().length < 10)
      return "Testimonial must be at least 10 characters.";
    if (form.testimonial.trim().length > MAX_TESTIMONIAL)
      return `Testimonial cannot exceed ${MAX_TESTIMONIAL} characters.`;
    if (!Number.isInteger(form.rating) || form.rating < 1 || form.rating > 5)
      return "Rating must be a whole number between 1 and 5.";
    return null;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const localError = validate();
    if (localError) {
      setError(localError);
      return;
    }

    const payload: CreateTestimonialPayload = {
      parentName: form.parentName.trim(),
      relationship: form.relationship,
      testimonial: form.testimonial.trim(),
      rating: form.rating,
      consentToPublish: form.consentToPublish,
    };

    if (isEdit && testimonial) {
      updateOne.mutate(
        { id: testimonial._id, payload },
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit review" : "Add review"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the testimonial details. Status is managed from the card."
              : "Manually add a parent testimonial. It will start as pending."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          {/* Parent name */}
          <div className="space-y-1.5">
            <label htmlFor="rv-name" className="text-sm font-medium">
              Parent name <span className="text-destructive">*</span>
            </label>
            <Input
              id="rv-name"
              autoFocus
              value={form.parentName}
              onChange={(e) => set("parentName", e.target.value)}
              placeholder="e.g. Sunita Gurung"
              maxLength={100}
              required
            />
          </div>

          {/* Relationship + Rating */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="rv-rel" className="text-sm font-medium">
                Relationship <span className="text-destructive">*</span>
              </label>
              <Choice
                id="rv-rel"
                value={form.relationship}
                options={[...RELATIONSHIPS]}
                onChange={(v) => set("relationship", v as Relationship)}
                label="Relationship"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Rating <span className="text-destructive">*</span>
              </label>
              <div
                className="flex items-center gap-1"
                role="radiogroup"
                aria-label="Rating"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={form.rating === n}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onClick={() => set("rating", n)}
                    className="rounded p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      size={22}
                      className={
                        n <= form.rating
                          ? "text-amber-500"
                          : "text-muted-foreground/40"
                      }
                      fill={n <= form.rating ? "currentColor" : "none"}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm tabular-nums text-muted-foreground">
                  {form.rating}/5
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="space-y-1.5">
            <label htmlFor="rv-body" className="text-sm font-medium">
              Testimonial <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="rv-body"
              value={form.testimonial}
              onChange={(e) => set("testimonial", e.target.value)}
              placeholder="Write the testimonial…"
              rows={6}
              maxLength={MAX_TESTIMONIAL}
              required
            />
            <p className="text-right text-xs text-muted-foreground">
              {form.testimonial.length}/{MAX_TESTIMONIAL}
            </p>
          </div>

          {/* Consent */}
          <label className="flex items-start gap-3 rounded-md border border-input p-3">
            <input
              type="checkbox"
              className="mt-0.5 size-4"
              checked={form.consentToPublish}
              onChange={(e) => set("consentToPublish", e.target.checked)}
            />
            <span className="text-sm">
              Parent has consented to publish this testimonial publicly.
            </span>
          </label>

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
              {isEdit ? "Save changes" : "Create review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}