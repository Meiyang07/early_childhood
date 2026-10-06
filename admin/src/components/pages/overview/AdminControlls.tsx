import { useNavigate } from 'react-router-dom';
import { Users, Star, Images, ClipboardList } from 'lucide-react';

const items = [
  { title: 'Staff & Teachers', text: 'Add / remove staff profiles', icon: Users, to: '/admin/staff', tone: 'blue' },
  { title: 'Reviews', text: 'Check parent reviews', icon: Star, to: '/admin/reviews', tone: 'green' },
  { title: 'Gallery', text: 'Add / remove photos', icon: Images, to: '/admin/gallery', tone: 'coral' },
  { title: 'Pending', text: 'Review pending admissions', icon: ClipboardList, to: '/admin/admissions', tone: 'blue' },
] as const;

export function AdminControls() {
  const navigate = useNavigate();
  return (
    <section className="admin-controls panel">
      <div>
        <h2>Admin Controls</h2>
        <p>Manage staff, feedback, communication, and pending requests.</p>
      </div>
      {items.map((item) => (
        <button key={item.title} onClick={() => navigate(item.to)}>
          <span>
            <item.icon size={17} className={`control-icon ${item.tone}`} />
            <strong>{item.title}</strong>
          </span>
          <p>{item.text}</p>
        </button>
      ))}
    </section>
  );
}