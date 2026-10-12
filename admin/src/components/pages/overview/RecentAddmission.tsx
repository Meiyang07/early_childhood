// src/pages/overview/RecentAdmissions.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ListAdmissionResponse } from "@/types/adimission";

type Props = {
  admissions: ListAdmissionResponse | undefined;
  loading: boolean;
};

function formatDate(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const statusClass: Record<string, string> = {
  pending: "badge badge--pending",
  approved: "badge badge--approved",
  declined: "badge badge--rejected",
  review: "badge badge--pending",
  rejected: "badge badge--rejected",
};

export function RecentAdmissions({ admissions, loading }: Props) {
  const raw: any[] = Array.isArray((admissions as any)?.data?.admissions)
    ? (admissions as any).data.admissions
    : Array.isArray((admissions as any)?.data)
    ? (admissions as any).data
    : [];

  const recent = [...raw]
    .sort((a, b) =>
      String(b.date ?? b.createdAt ?? "").localeCompare(
        String(a.date ?? a.createdAt ?? ""),
      ),
    )
    .slice(0, 5);

  return (
    <div className="recent-admissions">
      <div className="panel-heading">
        <div>
          <h2>Recent Admissions</h2>
          <p>Latest applications in your admin workspace</p>
        </div>
        <Button variant="ghost" className="view-all" asChild>
          <Link to="/admin/admissions">View all</Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2 py-4">
          <div className="h-8 w-full animate-pulse rounded bg-muted" />
          <div className="h-8 w-full animate-pulse rounded bg-muted" />
          <div className="h-8 w-full animate-pulse rounded bg-muted" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((a) => (
              <TableRow key={a._id ?? a.id} className="admission-row">
                <TableCell>
                  <span className="table-record-name">
                    {a.childInfo?.fullName ?? a.name ?? "—"}
                  </span>
                </TableCell>
                <TableCell>
                  {a.program ?? a.childInfo?.program ?? "—"}
                </TableCell>
                <TableCell>{formatDate(a.date ?? a.createdAt)}</TableCell>
                <TableCell>
                  <span className={statusClass[a.status?.toLowerCase()] ?? "badge"}>
                    {a.status ?? "—"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!loading && !recent.length && (
        <p className="table-empty">No applications yet.</p>
      )}
    </div>
  );
}