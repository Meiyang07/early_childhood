import { useNavigate } from 'react-router-dom';
import { usePortal } from '@/lib/portal';
import { StatCards } from './StatsCard';
import { RecentAdmissions } from './RecentAddmission';
import { QuickActions } from './QuickActions';
import { ContentSummary } from './ContentSummery';
import { AdminControls } from './AdminControlls';


export function OverviewPage() {
  const { data } = usePortal();
  const navigate = useNavigate();
  if (!data) return null;

  return (
    <>
      <StatCards records={data.records} />
      <section className="dashboard-main panel">
        <RecentAdmissions records={data.records} />
        <aside className="dashboard-right">
          <QuickActions />
          <ContentSummary records={data.records} />
        </aside>
      </section>
      <AdminControls />
      <div className="dashboard-note">
        <span>Admissions, messages, and reviews marked Example are sample records.</span>
        <span>Independent admin workspace</span>
      </div>
      {/* navigation helper available to children if needed */}
      <span hidden onClick={() => navigate('/admin')} />
    </>
  );
}