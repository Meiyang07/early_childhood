import { Bell, UserRound } from 'lucide-react';
import { Link, useLocation} from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';

import { config, type Section } from '@/types/admin';
import { useAuth } from '@/lib/auth';


const validSections: Section[] = [
  'overview', 'admissions', 'staff', 'reviews',
  'programs', 'gallery', 'events', 'blog', 'settings',
];

function useSection(): Section {
  const { pathname } = useLocation();
  const part = pathname.replace(/^\/admin\/?/, '').split('/')[0] || 'overview';
  return (validSections.includes(part as Section) ? part : 'overview') as Section;
}

export function AppHeader() {
  const section = useSection();
  const {user}=useAuth()


  const greeting = (() => {
    const hour = Number(
      new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: false, timeZone: 'Asia/Katmandu' })
        .format(new Date()),
    );
    return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  })();

  const title =
    section === 'overview'
      ? `${greeting}, ${user?.username}`
      : section === 'settings'
        ? 'Settings'
        : config[section].title;

  const subtitle =
    section === 'overview'
      ? 'Your school, organized in one place.'
      : section === 'settings'
        ? 'Update school details and your admin preferences.'
        : config[section].description;

  return (
    <header className="workspace-header">
      <div className="header-title">
        <SidebarTrigger className="mobile-menu" />
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="header-tools">
        
        <Link to="/admin/settings" className="account-button">
          <UserRound size={22} />
          <span>{user?.role ?? user?.role}</span>
        </Link>
      </div>
    </header>
  );
}