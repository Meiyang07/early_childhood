// src/pages/reviews/ReviewCard.tsx
import { useState } from "react";
import { Check, Pencil, Star, Trash2, X } from "lucide-react";

import type { Testimonial } from "@/types/testimonial";
import {
  useDeleteTestimonial,
  useUpdateTestimonialStatus,
} from "@/hook/useAdmin";

const statusClass: Record<Testimonial["status"], string> = {
  pending: "badge badge--pending",
  approved: "badge badge--approved",
  rejected: "badge badge--rejected",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ⬇ signature now takes onEdit
export function ReviewCard({
  testimonial,
  onEdit,
}: {
  testimonial: Testimonial;
  onEdit: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const updateStatus = useUpdateTestimonialStatus();
  const removeOne = useDeleteTestimonial();

  const isBusy = updateStatus.isPending || removeOne.isPending;

  function setStatus(status: Testimonial["status"]) {
    updateStatus.mutate({ id: testimonial._id, payload: { status } });
  }

  function handleDelete() {
    removeOne.mutate(testimonial._id, {
      onSettled: () => setConfirmDelete(false),
    });
  }

  return (
    <article className="review-card">
      <div className="review-top">
        <div
          className="review-stars"
          aria-label={`${testimonial.rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < testimonial.rating ? "currentColor" : "none"}
            />
          ))}
        </div>
        <span className={statusClass[testimonial.status]}>
          {testimonial.status}
        </span>
      </div>

      <blockquote className="review-body">{testimonial.testimonial}</blockquote>

      <div className="review-author">
        <strong>{testimonial.parentName}</strong>
        <span className="review-relationship">{testimonial.relationship}</span>
      </div>

      <div className="review-meta">
        <span>{formatDate(testimonial.createdAt)}</span>
        {!testimonial.consentToPublish && (
          <span className="review-consent-warning">
            Consent not given for publication
          </span>
        )}
      </div>

      <div className="review-actions">
        {testimonial.status !== "approved" && (
          <button
            type="button"
            className="btn btn--approve"
            onClick={() => setStatus("approved")}
            disabled={isBusy}
          >
            <Check size={16} /> Approve
          </button>
        )}

        {testimonial.status !== "rejected" && (
          <button
            type="button"
            className="btn btn--reject"
            onClick={() => setStatus("rejected")}
            disabled={isBusy}
          >
            <X size={16} /> Reject
          </button>
        )}

        {testimonial.status !== "pending" && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setStatus("pending")}
            disabled={isBusy}
          >
            Mark pending
          </button>
        )}

        {/* ⬇ NEW: edit button */}
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onEdit}
          disabled={isBusy}
          aria-label="Edit review"
        >
          <Pencil size={16} />
        </button>

        {!confirmDelete ? (
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => setConfirmDelete(true)}
            disabled={isBusy}
            aria-label="Delete review"
          >
            <Trash2 size={16} />
          </button>
        ) : (
          <div className="review-confirm-delete">
            <span>Delete?</span>
            <button
              type="button"
              className="btn btn--danger"
              onClick={handleDelete}
              disabled={isBusy}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setConfirmDelete(false)}
              disabled={isBusy}
            >
              No
            </button>
          </div>
        )}
      </div>
    </article>
  );
}