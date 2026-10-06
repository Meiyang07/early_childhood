import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { AdminRecord } from '@/types/admin';
import { today } from '@/types/admin';

export function StatCards({ records }: { records: AdminRecord[] }) {
  const admissions = records.filter((r) => r.kind === 'admissions');
  const month = today().slice(0, 7);

  const stats = [
    {
      label: 'New Admissions',
      value: admissions.filter((r) => r.data.date?.startsWith(month)).length,
      caption: 'This month',
      tone: 'blue',
      to: '/admin/admissions',
    },
    {
      label: 'Students',
      value: admissions.filter((r) => r.status === 'Approved').length,
      caption: 'Approved applications',
      tone: 'green',
      to: '/admin/admissions',
    },
    {
      label: 'Team Members',
      value: records.filter((r) => r.kind === 'staff' && r.status === 'Active').length,
      caption: 'Active staff',
      tone: 'coral',
      to: '/admin/staff',
    },
    {
      label: 'Messages',
      value: records.filter((r) => r.kind === 'messages' && r.status === 'Unread').length,
      caption: 'Need attention',
      tone: 'blue',
      to: '/admin/messages',
    },
  ];

  return (
    <section className="overview-section">
      <h2 className="section-label">Overview</h2>
      <div className="overview-stats">
        {stats.map((stat, i) => (
          <Link to={stat.to} className="stat" key={stat.label} style={{ '--order': i } as CSSProperties}>
            <span className="stat-label">
              {stat.label}
              <i className={`stat-dot ${stat.tone}`} />
            </span>
            <strong>{String(stat.value).padStart(2, '0')}</strong>
            <span className="stat-caption">{stat.caption}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}