// src/pages/overview/ContentSummary.tsx
import type { ListAdmissionResponse } from "@/types/adimission";
import type { ListStaffResponse } from "@/lib/public.api";
import type { ListProgramsResponse } from "@/types/program";
import type { ListPhotosResponse } from "@/types/photo";
import type { ListEventsResponse } from "@/types/event";

type Props = {
  admissions: ListAdmissionResponse | undefined;
  staff: ListStaffResponse | undefined;
  programs: ListProgramsResponse | undefined;
  photos: ListPhotosResponse | undefined;
  events: ListEventsResponse | undefined;
  loading: boolean;
};

function pickup<T>(resp: unknown, key: "data" | "staff" = "data"): T[] {
  const r = resp as any;
  if (!r) return [];
  if (key === "staff") return r.staff ?? [];
  if (Array.isArray(r.data)) return r.data;
  if (Array.isArray(r.data?.admissions)) return r.data.admissions;
  return [];
}

export function ContentSummary({
  admissions,
  staff,
  programs,
  photos,
  events,
  loading,
}: Props) {
  const admissionList = pickup<any>(admissions);
  const programList = pickup<any>(programs);
  const photoList = pickup<any>(photos);
  const eventList = pickup<any>(events);
  const staffList = pickup<any>(staff, "staff");

  const now = Date.now();

  const publishedPrograms = programList.filter(
    (p) => p.status === "published",
  ).length;

  const upcomingEvents = eventList.filter((e) => {
    if (e.status !== "published") return false;
    const t = new Date(e.eventDate).getTime();
    return Number.isFinite(t) && t >= now;
  }).length;

  const items: [string, number][] = [
    ["Published Programs", publishedPrograms],
    ["Team Profiles", staffList.length],
    ["Gallery Items", photoList.length],
    ["Upcoming Events", upcomingEvents],
  ];

  return (
    <section className="content-summary">
      <h2>Workspace Content</h2>
      <dl>
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{loading ? "…" : value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}