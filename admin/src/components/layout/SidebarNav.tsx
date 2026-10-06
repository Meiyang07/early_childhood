import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid, ClipboardList, Users, Star, Mail, BookOpen,
  Images, CalendarDays, FileText, Settings as SettingsIcon, LogOut,
} from 'lucide-react';
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar,
} from '@/components/ui/sidebar';
import { usePortal } from '@/lib/portal';
import { useAuth } from '@/lib/auth';

const nav = [
  { to: '/admin', end: true, label: 'Quick Actions', icon: LayoutGrid, badge: false },
  { to: '/admin/admissions', label: 'Admissions', icon: ClipboardList, badge: false },
  { to: '/admin/staff', label: 'Staff & Teachers', icon: Users, badge: false },
  { to: '/admin/reviews', label: 'Reviews', icon: Star, badge: false },
  { to: '/admin/programs', label: 'Programs', icon: BookOpen, badge: false },
  { to: '/admin/gallery', label: 'Gallery', icon: Images, badge: false },
  { to: '/admin/events', label: 'Events', icon: CalendarDays, badge: false },
  { to: '/admin/blog', label: 'Blog', icon: FileText, badge: false },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon, badge: false },
] as const;

export function SidebarNav() {
  const { data } = usePortal();
  const { logout } = useAuth();
  const { setOpenMobile } = useSidebar();
  const { pathname } = useLocation();

  const unread =
    data?.records.filter((r) => r.kind === 'messages' && r.status === 'Unread').length ?? 0;

  function isActive(item: (typeof nav)[number]) {
    if ('end' in item && item.end) return pathname === item.to;
    return pathname === item.to || pathname.startsWith(item.to + '/');
  }

  return (
    <Sidebar className="school-sidebar">
      <SidebarHeader className="school-sidebar-brand">
        <img src="/assets/school-logo.jpg" alt="Early Childhood logo" width="52" height="52" />
        <div>
          <strong>Early Childhood</strong>
          <span>Montessori</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <nav aria-label="Admin navigation" className="sidebar-nav">
          <SidebarMenu>
            {nav.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item)}
                  className="school-nav-button"
                >
                  <NavLink to={item.to} onClick={() => setOpenMobile(false)}>
                    <item.icon size={18} />
                    <span>{item.label}</span>
                    {item.badge && unread > 0 && <b className="nav-count">{unread}</b>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </nav>
      </SidebarContent>

      <SidebarFooter className="school-sidebar-footer">
        <button type="button" onClick={logout}>
          <LogOut size={19} /> Log out
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}