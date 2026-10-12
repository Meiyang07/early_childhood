// src/pages/gallery/PhotoFormDialog.tsx
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
  useCreatePhoto,
  useReplacePhotoImage,
  useUpdatePhoto,
} from "@/hook/useAdmin";
import type {
  CreatePhotoPayload,
  Photo,
  PhotoCategory,
  PhotoStatus,
  UpdatePhotoPayload,
} from "@/types/photo";
import { ImagePicker } from "../records/ImagePicker";

type Props = {
  open: boolean;
  onClose: () => void;
  photo?: Photo | null;
};

const CATEGORIES: PhotoCategory[] = [
  "classroom",
  "activities",
  "outdoors",
  "graduation",
];

const STATUSES: PhotoStatus[] = ["draft", "published"];

const MAX_DESC = 500;

type FormState = {
  title: string;
  category: PhotoCategory;
  imageDescription: string;
  status: PhotoStatus;
};

const empty: FormState = {
  title: "",
  category: "classroom",
  imageDescription: "",
  status: "draft",
};

export function PhotoFormDialog({ open, onClose, photo }: Props) {
  const isEdit = !!photo;

  const createOne = useCreatePhoto();
  const updateOne = useUpdatePhoto();
  const replaceImage = useReplacePhotoImage();
  const isSubmitting =
    createOne.isPending || updateOne.isPending || replaceImage.isPending;

  const [form, setForm] = useState<FormState>(empty);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setImage(null);
    if (photo) {
      setForm({
        title: photo.title,
        category: photo.category,
        imageDescription: photo.imageDescription,
        status: photo.status,
      });
    } else {
      setForm(empty);
    }
  }, [open, photo]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (error) setError("");
  }

  function validate(): string | null {
    if (form.title.trim().length < 2)
      return "Title must be at least 2 characters.";
    if (form.title.trim().length > 150)
      return "Title cannot exceed 150 characters.";
    if (form.imageDescription.trim().length < 5)
      return "Description must be at least 5 characters.";
    if (form.imageDescription.trim().length > MAX_DESC)
      return `Description cannot exceed ${MAX_DESC} characters.`;
    if (!isEdit && !image) return "Please choose a photo.";
    return null;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const localError = validate();
    if (localError) {
      setError(localError);
      return;
    }

    if (!isEdit) {
      // CREATE — multipart
      const payload: CreatePhotoPayload = {
        title: form.title.trim(),
        category: form.category,
        imageDescription: form.imageDescription.trim(),
        status: form.status,
        image: image!,
      };
      createOne.mutate(payload, { onSuccess: () => onClose() });
      return;
    }

    // EDIT — metadata first, then optionally replace the image
    const payload: UpdatePhotoPayload = {
      title: form.title.trim(),
      category: form.category,
      imageDescription: form.imageDescription.trim(),
      status: form.status,
    };

    updateOne.mutate(
      { id: photo!._id, payload },
      {
        onSuccess: () => {
          if (image) {
            replaceImage.mutate(
              { id: photo!._id, payload: { image } },
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit photo" : "Add photo"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the photo details, or replace the image."
              : "Upload a new photo and fill in its details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <ImagePicker
            value={image}
            onChange={setImage}
            existingUrl={photo?.image}
            shape="rounded"
            label={isEdit ? "Replace image (optional)" : "Photo"}
            hint="JPG, PNG · max 5 MB"
          />

          <div className="space-y-1.5">
            <label htmlFor="ph-title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="ph-title"
              autoFocus
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Morning Circle Time"
              maxLength={150}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="ph-cat" className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </label>
              <Choice
                id="ph-cat"
                value={form.category}
                options={CATEGORIES}
                onChange={(v) => set("category", v as PhotoCategory)}
                label="Category"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ph-status" className="text-sm font-medium">
                Status
              </label>
              <Choice
                id="ph-status"
                value={form.status}
                options={STATUSES}
                onChange={(v) => set("status", v as PhotoStatus)}
                label="Status"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="ph-desc" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="ph-desc"
              value={form.imageDescription}
              onChange={(e) => set("imageDescription", e.target.value)}
              placeholder="Describe what's happening in this photo…"
              rows={4}
              maxLength={MAX_DESC}
              required
            />
            <p className="text-right text-xs text-muted-foreground">
              {form.imageDescription.length}/{MAX_DESC}
            </p>
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
              {isEdit ? "Save changes" : "Upload photo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}