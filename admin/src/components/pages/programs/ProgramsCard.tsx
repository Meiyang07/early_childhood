// src/pages/programs/ProgramCard.tsx
import { useState } from "react";
import {
  BookOpen,
  CalendarClock,
  Check,
  Pencil,
  Trash2,
  Users,
  UserCheck,
  Wallet,
  X,
} from "lucide-react";
import type { Program } from "@/types/program";
import { useDeleteProgram, useUpdateProgram } from "@/hook/useAdmin";

const statusClass: Record<Program["status"], string> = {
  published: "badge badge--approved",
  draft: "badge badge--pending",
};

function formatFee(amount: number) {
  return `Rs ${amount.toLocaleString()}`;
}

export function ProgramCard({
  program,
  onEdit,
}: {
  program: Program;
  onEdit: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateOne = useUpdateProgram();
  const removeOne = useDeleteProgram();
  const isBusy = updateOne.isPending || removeOne.isPending;

  function setStatus(status: Program["status"]) {
    updateOne.mutate({ id: program._id, payload: { status } });
  }

  function handleDelete() {
    removeOne.mutate(program._id, {
      onSettled: () => setConfirmDelete(false),
    });
  }

  return (
    <article className="review-card flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">{program.name}</h2>
          <p className="text-xs text-muted-foreground">{program.ageRange}</p>
        </div>
        <span className={statusClass[program.status]}>{program.status}</span>
      </div>

      {/* Description */}
      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {program.description}
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs">
        <Stat icon={<CalendarClock size={14} />} label="Duration">
          {program.classDuration}
        </Stat>
        <Stat icon={<Wallet size={14} />} label="Monthly fee">
          {formatFee(program.monthlyFee)}
        </Stat>
        <Stat icon={<UserCheck size={14} />} label="Teachers">
          {program.noOfTeachers}
        </Stat>
        <Stat icon={<Users size={14} />} label="Children">
          {program.noOfChildren}
        </Stat>
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-3">
        {program.status !== "published" && (
          <button
            type="button"
            className="btn btn--approve"
            onClick={() => setStatus("published")}
            disabled={isBusy}
          >
            <Check size={16} /> Publish
          </button>
        )}

        {program.status !== "draft" && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setStatus("draft")}
            disabled={isBusy}
          >
            <BookOpen size={16} /> Move to draft
          </button>
        )}

        <button
          type="button"
          className="btn btn--ghost"
          onClick={onEdit}
          disabled={isBusy}
          aria-label="Edit program"
        >
          <Pencil size={16} />
        </button>

        {!confirmDelete ? (
          <button
            type="button"
            className="btn btn--danger"
            onClick={() => setConfirmDelete(true)}
            disabled={isBusy}
            aria-label="Delete program"
          >
            <Trash2 size={16} />
          </button>
        ) : (
          <div className="ml-auto inline-flex items-center gap-2 text-sm">
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
              <X size={14} /> No
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function Stat({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-foreground">{children}</p>
      </div>
    </div>
  );
}