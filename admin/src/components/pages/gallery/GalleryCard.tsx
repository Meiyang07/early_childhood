// src/pages/gallery/GalleryCard.tsx
import { Expand, Eye, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { Photo } from "@/types/photo";
import { useDeletePhoto, useUpdatePhoto } from "@/hook/useAdmin";

const statusClass: Record<Photo["status"], string> = {
  published: "badge badge--approved",
  draft: "badge badge--pending",
};

export function GalleryCard({
  photo,
  onOpen,
  onEdit,
}: {
  photo: Photo;
  onOpen: () => void;
  onEdit: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const removeOne = useDeletePhoto();
  const updateOne = useUpdatePhoto();
  const isBusy = removeOne.isPending || updateOne.isPending;

  function handleDelete() {
    removeOne.mutate(photo._id, {
      onSettled: () => setConfirmDelete(false),
    });
  }

  function toggleStatus() {
    const next = photo.status === "published" ? "draft" : "published";
    updateOne.mutate({ id: photo._id, payload: { status: next } });
  }

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <button
        type="button"
        onClick={onOpen}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-muted"
        aria-label={`Open ${photo.title}`}
      >
        <img
          src={photo.image}
          alt={photo.imageDescription}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition-opacity duration-200 group-hover:bg-black/40 group-hover:opacity-100">
          <Expand size={24} />
        </span>
      </button>

      {/* Caption */}
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{photo.title}</h3>
            <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
              {photo.category}
            </p>
          </div>
          <span className={statusClass[photo.status]}>{photo.status}</span>
        </div>

        <p className="line-clamp-2 text-xs text-muted-foreground">
          {photo.imageDescription}
        </p>

        {/* Actions */}
        <div className="mt-1 flex items-center gap-1 border-t border-border pt-2">
          <button
            type="button"
            onClick={onOpen}
            disabled={isBusy}
            className="btn btn--ghost"
            aria-label="View"
          >
            <Eye size={14} />
          </button>

          <button
            type="button"
            onClick={toggleStatus}
            disabled={isBusy}
            className="btn btn--ghost text-xs"
          >
            {photo.status === "published" ? "Unpublish" : "Publish"}
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
      </div>
    </article>
  );
}