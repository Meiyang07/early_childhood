import { Bell, UserRound } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { config, type Section } from '@/types/admin';
import { usePortal } from '@/lib/portal';

const validSections: Section[] = [
  'overview', 'admissions', 'staff', 'reviews', 'messages',
  'programs', 'gallery', 'events', 'blog', 'settings',
];

function useSection(): Section {
  const { pathname } = useLocation();
  const part = pathname.replace(/^\/admin\/?/, '').split('/')[0] || 'overview';
  return (validSections.includes(part as Section) ? part : 'overview') as Section;
}

export function AppHeader() {
  const section = useSection();
  const { data } = usePortal();
  const navigate = useNavigate();

  const unread =
    data?.records.filter((r) => r.kind === 'messages' && r.status === 'Unread').length ?? 0;

  const greeting = (() => {
    const hour = Number(
      new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: false, timeZone: 'Asia/Katmandu' })
        .format(new Date()),
    );
    return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  })();

  const title =
    section === 'overview'
      ? `${greeting}, ${data?.settings.adminName ?? 'Admin'}`
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
        <Button
          variant="ghost"
          size="icon"
          className="notification-button"
          aria-label={`${unread} unread messages`}
          onClick={() => navigate('/admin/messages')}
        >
          <Bell size={23} />
          {unread > 0 && <span />}
        </Button>
        <Link to="/admin/settings" className="account-button">
          <UserRound size={22} />
          <span>{data?.settings.adminName ?? 'Admin'}</span>
        </Link>
      </div>
    </header>
  );
}