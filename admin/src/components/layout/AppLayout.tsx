import type { CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from './SidebarNav';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';


export function AppLayout() {
  return (
    <SidebarProvider style={{ '--sidebar-width': '16.75rem' } as CSSProperties}>
      <SidebarNav />
      <SidebarInset className="admin-workspace">
        <a href="#workspace" className="skip-link">Skip to workspace</a>
        <AppHeader />
        <div id="workspace" className="workspace-content">
          <Outlet />
        </div>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}