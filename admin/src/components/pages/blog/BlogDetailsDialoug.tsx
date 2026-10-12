// src/pages/blog/BlogDetailsDialog.tsx
import { Pencil, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBlogById } from "@/hook/usePublic";
import type { Blog } from "@/types/blog";

const statusClass: Record<Blog["status"], string> = {
  published: "badge badge--approved",
  draft: "badge badge--pending",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogDetailsDialog({
  blogId,
  onClose,
  onEdit,
}: {
  blogId: string | null;
  onClose: () => void;
  onEdit: (blog: Blog) => void;
}) {
  const open = !!blogId;
  const { data: blog, isLoading, isError, error } = useBlogById(
    blogId ?? undefined,
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="pr-8">{blog?.title ?? "Blog post"}</DialogTitle>
          <DialogDescription>
            {blog ? `${blog.author} · ${formatDate(blog.postDate)}` : "Loading…"}
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-3 py-4">
            <div className="aspect-video w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-24 w-full animate-pulse rounded bg-muted" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            {error?.message ?? "Failed to load blog post"}
          </p>
        )}

        {blog && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={statusClass[blog.status]}>{blog.status}</span>
            </div>

            <img
              src={blog.blogImage}
              alt={blog.title}
              className="w-full rounded-lg object-cover"
            />

            <p className="border-l-4 border-primary/40 pl-3 text-sm italic text-muted-foreground">
              {blog.shortIntroduction}
            </p>

            <div className="whitespace-pre-line text-sm leading-relaxed text-foreground">
              {blog.article}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>
                Created {new Date(blog.createdAt).toLocaleDateString()}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit(blog)}
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