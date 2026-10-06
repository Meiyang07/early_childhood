import type { AdminRecord } from '@/types/admin';
import { today } from '@/types/admin';

export function ContentSummary({ records }: { records: AdminRecord[] }) {
  const items: [string, number][] = [
    ['Published Programs', records.filter((r) => r.kind === 'programs' && r.status === 'Published').length],
    ['Team Profiles', records.filter((r) => r.kind === 'staff').length],
    ['Gallery Items', records.filter((r) => r.kind === 'gallery').length],
    ['Upcoming Events', records.filter((r) => r.kind === 'events' && r.status === 'Published' && r.data.date >= today()).length],
    ['Unread Messages', records.filter((r) => r.kind === 'messages' && r.status === 'Unread').length],
  ];

  return (
    <section className="content-summary">
      <h2>Workspace Content</h2>
      <dl>
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}