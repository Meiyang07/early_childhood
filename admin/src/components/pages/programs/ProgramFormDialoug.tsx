// src/pages/programs/ProgramFormDialog.tsx
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

import type {
  CreateProgramPayload,
  Program,
  ProgramStatus,
} from "@/types/program";
import { useCreatePrograms, useUpdateProgram } from "@/hook/useAdmin";

type Props = {
  open: boolean;
  onClose: () => void;
  program?: Program | null;
};

const STATUSES: ProgramStatus[] = ["draft", "published"];

type FormState = {
  name: string;
  ageRange: string;
  classDuration: string;
  noOfTeachers: number;
  noOfChildren: number;
  monthlyFee: number;
  description: string;
  status: ProgramStatus;
};

const empty: FormState = {
  name: "",
  ageRange: "",
  classDuration: "",
  noOfTeachers: 1,
  noOfChildren: 1,
  monthlyFee: 0,
  description: "",
  status: "draft",
};

const MAX_DESC = 2000;

export function ProgramFormDialog({ open, onClose, program }: Props) {
  const isEdit = !!program;
  const createOne = useCreatePrograms();
  const updateOne = useUpdateProgram();
  const isSubmitting = createOne.isPending || updateOne.isPending;

  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    if (program) {
      setForm({
        name: program.name,
        ageRange: program.ageRange,
        classDuration: program.classDuration,
        noOfTeachers: program.noOfTeachers,
        noOfChildren: program.noOfChildren,
        monthlyFee: program.monthlyFee,
        description: program.description,
        status: program.status,
      });
    } else {
      setForm(empty);
    }
  }, [open, program]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (error) setError("");
  }

  function validate(): string | null {
    if (form.name.trim().length < 2)
      return "Program name must be at least 2 characters.";
    if (form.name.trim().length > 120)
      return "Program name cannot exceed 120 characters.";
    if (form.ageRange.trim().length < 1) return "Age range is required.";
    if (form.classDuration.trim().length < 1)
      return "Class duration is required.";
    if (form.noOfTeachers < 1) return "At least 1 teacher is required.";
    if (form.noOfChildren < 1) return "At least 1 child is required.";
    if (form.monthlyFee < 0) return "Monthly fee cannot be negative.";
    if (form.description.trim().length < 10)
      return "Description must be at least 10 characters.";
    if (form.description.trim().length > MAX_DESC)
      return `Description cannot exceed ${MAX_DESC} characters.`;
    return null;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const localError = validate();
    if (localError) {
      setError(localError);
      return;
    }

    const payload: CreateProgramPayload = {
      name: form.name.trim(),
      ageRange: form.ageRange.trim(),
      classDuration: form.classDuration.trim(),
      noOfTeachers: Number(form.noOfTeachers),
      noOfChildren: Number(form.noOfChildren),
      monthlyFee: Number(form.monthlyFee),
      description: form.description.trim(),
      status: form.status,
    };

    if (isEdit && program) {
      updateOne.mutate(
        { id: program._id, payload },
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
          <DialogTitle>{isEdit ? "Edit program" : "Add program"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this program's details."
              : "Create a new program. Save as draft or publish immediately."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="pg-name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="pg-name"
              autoFocus
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Toddler Playgroup"
              maxLength={120}
              required
            />
          </div>

          {/* Age + Duration */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="pg-age" className="text-sm font-medium">
                Age range <span className="text-destructive">*</span>
              </label>
              <Input
                id="pg-age"
                value={form.ageRange}
                onChange={(e) => set("ageRange", e.target.value)}
                placeholder="e.g. 2-4 years"
                maxLength={50}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pg-duration" className="text-sm font-medium">
                Class duration <span className="text-destructive">*</span>
              </label>
              <Input
                id="pg-duration"
                value={form.classDuration}
                onChange={(e) => set("classDuration", e.target.value)}
                placeholder="e.g. 3 hours (9:00 AM - 12:00 PM)"
                maxLength={50}
                required
              />
            </div>
          </div>

          {/* Teachers / Children / Fee */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label htmlFor="pg-teachers" className="text-sm font-medium">
                Teachers <span className="text-destructive">*</span>
              </label>
              <Input
                id="pg-teachers"
                type="number"
                min={1}
                max={50}
                step={1}
                value={form.noOfTeachers}
                onChange={(e) => set("noOfTeachers", Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pg-children" className="text-sm font-medium">
                Children <span className="text-destructive">*</span>
              </label>
              <Input
                id="pg-children"
                type="number"
                min={1}
                max={500}
                step={1}
                value={form.noOfChildren}
                onChange={(e) => set("noOfChildren", Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pg-fee" className="text-sm font-medium">
                Monthly fee (Rs) <span className="text-destructive">*</span>
              </label>
              <Input
                id="pg-fee"
                type="number"
                min={0}
                max={1000000}
                step={1}
                value={form.monthlyFee}
                onChange={(e) => set("monthlyFee", Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="pg-desc" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="pg-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the program…"
              rows={5}
              maxLength={MAX_DESC}
              required
            />
            <p className="text-right text-xs text-muted-foreground">
              {form.description.length}/{MAX_DESC}
            </p>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label htmlFor="pg-status" className="text-sm font-medium">
              Status
            </label>
            <Choice
              id="pg-status"
              value={form.status}
              options={STATUSES}
              onChange={(v) => set("status", v as ProgramStatus)}
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
              {isEdit ? "Save changes" : "Create program"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}