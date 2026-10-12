// src/pages/overview/StatsCard.tsx
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { ListAdmissionResponse } from "@/types/adimission";
import type { ListStaffResponse } from "@/lib/public.api";
import type { ListProgramsResponse } from "@/types/program";

type Props = {
  admissions: ListAdmissionResponse | undefined;
  staff: ListStaffResponse | undefined;
  programs: ListProgramsResponse | undefined;
  loading: boolean;
};

/** Counts admissions submitted in the current calendar month. */
function countThisMonth(dates: (string | undefined)[]): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  return dates.filter((d) => {
    if (!d) return false;
    const dt = new Date(d);
    return dt.getFullYear() === year && dt.getMonth() === month;
  }).length;
}

/** Counts approved admissions (any status field your backend uses). */
function countApproved(
  items: { status?: string }[] | undefined,
): number {
  if (!items) return 0;
  return items.filter((x) => x.status?.toLowerCase() === "approved").length;
}

export function StatCards({ admissions, staff, programs, loading }: Props) {
  // admissions.data is likely the array; adjust key if your API wraps differently
  const admissionList = (admissions as any)?.data?.admissions ?? (admissions as any)?.data ?? [];
  const admissionDates: (string | undefined)[] = Array.isArray(admissionList)
    ? admissionList.map((a: any) => a.date ?? a.createdAt)
    : [];

  const thisMonth = loading ? 0 : countThisMonth(admissionDates);
  const approved = loading ? 0 : countApproved(admissionList);

  const activeStaff = loading
    ? 0
    : (staff?.staff ?? []).filter((s) => s.status?.toLowerCase() === "active").length;

  const programTotal = loading ? 0 : programs?.pagination?.total ?? 0;

  const stats = [
    {
      label: "New Admissions",
      value: thisMonth,
      caption: "This month",
      tone: "blue",
      to: "/admin/admissions",
    },
    {
      label: "Students",
      value: approved,
      caption: "Approved applications",
      tone: "green",
      to: "/admin/admissions",
    },
    {
      label: "Team Members",
      value: activeStaff,
      caption: "Active staff",
      tone: "coral",
      to: "/admin/staff",
    },
    {
      label: "Programs",
      value: programTotal,
      caption: "Total on offer",
      tone: "blue",
      to: "/admin/programs",
    },
  ];

  return (
    <section className="overview-section">
      <h2 className="section-label">Overview</h2>
      <div className="overview-stats">
        {stats.map((stat, i) => (
          <Link
            to={stat.to}
            className="stat"
            key={stat.label}
            style={{ "--order": i } as CSSProperties}
          >
            <span className="stat-label">
              {stat.label}
              <i className={`stat-dot ${stat.tone}`} />
            </span>
            <strong>{String(stat.value).padStart(2, "0")}</strong>
            <span className="stat-caption">{stat.caption}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}