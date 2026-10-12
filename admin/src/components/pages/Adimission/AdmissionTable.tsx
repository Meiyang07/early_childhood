import { Eye, Pencil, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AdmissionApplication } from "@/types/adimission";
import { AdmissionStatusBadge } from "./AdimissionStatusBadge";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const HEADERS = [
  "Applicant",
  "Program",
  "Guardian",
  "Submitted",
  "Status",
  "Actions",
];

export function AdmissionTable({
  applications,
  onView,
  onEdit,
  onRemove,
}: {
  applications: AdmissionApplication[];
  onView: (app: AdmissionApplication) => void;
  onEdit: (app: AdmissionApplication) => void;
  onRemove: (app: AdmissionApplication) => void;
}) {
  return (
    <section className="panel records-table">
      <Table>
        <TableHeader>
          <TableRow className="border-b-gray-200">
            {HEADERS.map((label, i) => (
              <TableHead
                key={label}
                className={i === HEADERS.length - 1 ? "text-right" : ""}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app._id} className="group">
              {/* Applicant */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {initials(app.childInfo.fullName)}
                  </div>
                  <div className="min-w-0">
                    <button
                      type="button"
                      className="table-record-name block truncate text-left"
                      onClick={() => onView(app)}
                    >
                      {app.childInfo.fullName}
                    </button>
                    <p className="truncate text-xs text-muted-foreground">
                      {app.childInfo.gender} ·{" "}
                      {formatDate(app.childInfo.dateOfBirth)}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Program */}
              <TableCell>
                <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                  {app.childInfo.applyingForProgram}
                </span>
              </TableCell>

              {/* Guardian */}
              <TableCell>
                <p className="text-sm font-medium">
                  {app.guardianInfo.fullName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {app.guardianInfo.email}
                </p>
              </TableCell>

              {/* Submitted */}
              <TableCell>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {formatDate(app.submittedAt)}
                </span>
              </TableCell>

              {/* Status */}
              <TableCell>
                <AdmissionStatusBadge status={app.status} />
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="View"
                    onClick={() => onView(app)}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Edit"
                    onClick={() => onEdit(app)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete"
                    className="remove-button text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onRemove(app)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}