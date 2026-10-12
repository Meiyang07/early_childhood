// src/pages/blog/BlogCard.tsx
import { useState } from "react";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import type { Blog } from "@/types/blog";
import { useDeleteBlog, useUpdateBlog } from "@/hook/useAdmin";

const statusClass: Record<Blog["status"], string> = {
  published: "badge badge--approved",
  draft: "badge badge--pending",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogCard({
  blog,
  onView,
  onEdit,
}: {
  blog: Blog;
  onView: () => void;
  onEdit: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const removeOne = useDeleteBlog();
  const updateOne = useUpdateBlog();
  const isBusy = removeOne.isPending || updateOne.isPending;

  function toggleStatus() {
    const next = blog.status === "published" ? "draft" : "published";
    updateOne.mutate({ id: blog._id, payload: { status: next } });
  }

  function handleDelete() {
    removeOne.mutate(blog._id, {
      onSettled: () => setConfirmDelete(false),
    });
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Cover image */}
      <button
        type="button"
        onClick={onView}
        className="relative block aspect-[16/9] w-full overflow-hidden bg-muted"
        aria-label={`Open ${blog.title}`}
      >
        <img
          src={blog.blogImage}
          alt={blog.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition-opacity duration-200 group-hover:bg-black/40 group-hover:opacity-100">
          <Eye size={22} />
        </span>
      </button>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-base font-semibold">
              {blog.title}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {blog.author} · {formatDate(blog.postDate)}
            </p>
          </div>
          <span className={statusClass[blog.status]}>{blog.status}</span>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {blog.shortIntroduction}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <button
            type="button"
            onClick={onView}
            disabled={isBusy}
            className="btn btn--ghost"
            aria-label="View post"
          >
            <Eye size={14} /> View
          </button>

          <button
            type="button"
            onClick={toggleStatus}
            disabled={isBusy}
            className="btn btn--ghost text-xs"
          >
            {blog.status === "published" ? "Unpublish" : "Publish"}
          </button>

          <button
            type="button"
            onClick={onEdit}
            disabled={isBusy}
            className="btn btn--ghost"
            aria-label="Edit post"
          >
            <Pencil size={14} />
          </button>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={isBusy}
              className="btn btn--danger ml-auto"
              aria-label="Delete post"
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