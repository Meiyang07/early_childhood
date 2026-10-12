// src/pages/blog/BlogFormDialog.tsx
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

import {
  useCreateBlog,
  useReplaceBlogImage,
  useUpdateBlog,
} from "@/hook/useAdmin";
import type {
  Blog,
  BlogStatus,
  CreateBlogPayload,
  UpdateBlogPayload,
} from "@/types/blog";
import { ImagePicker } from "../records/ImagePicker";

type Props = {
  open: boolean;
  onClose: () => void;
  blog?: Blog | null;
};

const STATUSES: BlogStatus[] = ["draft", "published"];
const MAX_ARTICLE = 50000;
const MAX_INTRO = 500;

type FormState = {
  title: string;
  postDate: string;     // "YYYY-MM-DD"
  author: string;
  shortIntroduction: string;
  article: string;
  status: BlogStatus;
};

const empty: FormState = {
  title: "",
  postDate: new Date().toISOString().slice(0, 10),
  author: "",
  shortIntroduction: "",
  article: "",
  status: "draft",
};

/** Safe ISO → "YYYY-MM-DD". Returns "" on invalid input. */
function toDateInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function BlogFormDialog({ open, onClose, blog }: Props) {
  const isEdit = !!blog;
  const createOne = useCreateBlog();
  const updateOne = useUpdateBlog();
  const replaceImage = useReplaceBlogImage();
  const isSubmitting =
    createOne.isPending || updateOne.isPending || replaceImage.isPending;

  const [form, setForm] = useState<FormState>(empty);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setImage(null);
    if (blog) {
      setForm({
        title: blog.title,
        postDate: toDateInput(blog.postDate),
        author: blog.author,
        shortIntroduction: blog.shortIntroduction,
        article: blog.article,
        status: blog.status,
      });
    } else {
      setForm(empty);
    }
  }, [open, blog]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (error) setError("");
  }

  function validate(): string | null {
    if (form.title.trim().length < 2)
      return "Title must be at least 2 characters.";
    if (form.title.trim().length > 200)
      return "Title cannot exceed 200 characters.";
    if (!form.postDate) return "Post date is required.";
    if (form.author.trim().length < 2)
      return "Author must be at least 2 characters.";
    if (form.author.trim().length > 100)
      return "Author cannot exceed 100 characters.";
    if (form.shortIntroduction.trim().length < 10)
      return "Short introduction must be at least 10 characters.";
    if (form.shortIntroduction.trim().length > MAX_INTRO)
      return `Short introduction cannot exceed ${MAX_INTRO} characters.`;
    if (form.article.trim().length < 50)
      return "Article must be at least 50 characters.";
    if (form.article.trim().length > MAX_ARTICLE)
      return `Article cannot exceed ${MAX_ARTICLE} characters.`;
    if (!isEdit && !image) return "Please choose a cover image.";
    return null;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const localError = validate();
    if (localError) {
      setError(localError);
      return;
    }

    // Always send postDate as an ISO date string
    const isoDate = new Date(`${form.postDate}T00:00:00.000Z`).toISOString();

    if (!isEdit) {
      // CREATE — multipart
      const payload: CreateBlogPayload = {
        title: form.title.trim(),
        postDate: isoDate,
        author: form.author.trim(),
        shortIntroduction: form.shortIntroduction.trim(),
        article: form.article.trim(),
        status: form.status,
        image: image!,
      };
      createOne.mutate(payload, { onSuccess: () => onClose() });
      return;
    }

    // EDIT — metadata first, then optionally replace the image
    const payload: UpdateBlogPayload = {
      title: form.title.trim(),
      postDate: isoDate,
      author: form.author.trim(),
      shortIntroduction: form.shortIntroduction.trim(),
      article: form.article.trim(),
      status: form.status,
    };

    updateOne.mutate(
      { id: blog!._id, payload },
      {
        onSuccess: () => {
          if (image) {
            replaceImage.mutate(
              { id: blog!._id, payload: { image } },
              { onSettled: () => onClose() },
            );
          } else {
            onClose();
          }
        },
      },
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o && !isSubmitting) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit blog post" : "Add blog post"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this post's details, or replace its cover image."
              : "Create a new blog post. Save as draft or publish immediately."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <ImagePicker
            value={image}
            onChange={setImage}
            existingUrl={blog?.blogImage}
            shape="rounded"
            label={isEdit ? "Replace cover image (optional)" : "Cover image"}
            hint="JPG, PNG · max 5 MB"
          />

          <div className="space-y-1.5">
            <label htmlFor="bl-title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="bl-title"
              autoFocus
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. 5 Tips to Help Your Child Love Reading"
              maxLength={200}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="bl-date" className="text-sm font-medium">
                Post date <span className="text-destructive">*</span>
              </label>
              <Input
                id="bl-date"
                type="date"
                value={form.postDate}
                onChange={(e) => set("postDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bl-author" className="text-sm font-medium">
                Author <span className="text-destructive">*</span>
              </label>
              <Input
                id="bl-author"
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                placeholder="e.g. Mrs. Anita Sharma"
                maxLength={100}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bl-intro" className="text-sm font-medium">
              Short introduction <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="bl-intro"
              value={form.shortIntroduction}
              onChange={(e) => set("shortIntroduction", e.target.value)}
              placeholder="One or two sentences summarizing the post…"
              rows={3}
              maxLength={MAX_INTRO}
              required
            />
            <p className="text-right text-xs text-muted-foreground">
              {form.shortIntroduction.length}/{MAX_INTRO}
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bl-article" className="text-sm font-medium">
              Article <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="bl-article"
              value={form.article}
              onChange={(e) => set("article", e.target.value)}
              placeholder="Write the full article…"
              rows={12}
              maxLength={MAX_ARTICLE}
              required
            />
            <p className="text-right text-xs text-muted-foreground">
              {form.article.length}/{MAX_ARTICLE}
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bl-status" className="text-sm font-medium">
              Status
            </label>
            <Choice
              id="bl-status"
              value={form.status}
              options={STATUSES}
              onChange={(v) => set("status", v as BlogStatus)}
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
              {isEdit ? "Save changes" : "Create post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}