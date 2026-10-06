import { Users, CalendarDays, FileText, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { to: '/admin/staff', icon: Users, label: 'Add Team Member' },
  { to: '/admin/events', icon: CalendarDays, label: 'Create Event' },
  { to: '/admin/blog', icon: FileText, label: 'Create Blog' },
] as const;

export function QuickActions() {
  const navigate = useNavigate();
  return (
    <section className="quick-actions">
      <h2>Quick Actions</h2>
      {actions.map((a) => (
        <button key={a.to} onClick={() => navigate(a.to)}>
          <a.icon size={17} />
          <span>{a.label}</span>
          <Plus size={16} />
        </button>
      ))}
    </section>
  );
}