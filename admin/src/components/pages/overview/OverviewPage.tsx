// src/pages/overview/OverviewPage.tsx
import { useListAdimission } from "@/hook/useAdmin";
import { useListStaff } from "@/hook/usePublic";
import { useListPrograms } from "@/hook/usePublic";
import { useListPhotos } from "@/hook/usePublic";
import { useListEvents } from "@/hook/usePublic";

import { StatCards } from "./StatsCard";

import { QuickActions } from "./QuickActions";
import { RecentAdmissions } from "./RecentAddmission";
import { ContentSummary } from "./ContentSummery";
import { AdminControls } from "./AdminControlls";


export function OverviewPage() {
  // Each stat/section pulls from its own list endpoint.
  // Limit is small so the dashboard stays fast — we only need counts and a preview.
  const admissions = useListAdimission({});
  const staff = useListStaff({});
  const programs = useListPrograms({ page: 1, limit: 1 });
  const photos = useListPhotos({ page: 1, limit: 1 });
  const events = useListEvents({ page: 1, limit: 5 });

  const isAnyLoading =
    admissions.isLoading ||
    staff.isLoading ||
    programs.isLoading ||
    photos.isLoading ||
    events.isLoading;

  return (
    <>
      <StatCards
        admissions={admissions.data}
        staff={staff.data}
        programs={programs.data}
        loading={isAnyLoading}
      />

      <section className="dashboard-main panel">
        <RecentAdmissions
          admissions={admissions.data}
          loading={admissions.isLoading}
        />
        <aside className="dashboard-right">
          <QuickActions />
          <ContentSummary
            admissions={admissions.data}
            staff={staff.data}
            programs={programs.data}
            photos={photos.data}
            events={events.data}
            loading={isAnyLoading}
          />
        </aside>
      </section>

      <AdminControls />

      <div className="dashboard-note">
        <span>All figures are live from the server.</span>
        <span>Independent admin workspace</span>
      </div>
    </>
  );
}