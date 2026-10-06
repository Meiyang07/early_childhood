import { ShieldCheck } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="workspace-footer">
      <span>Admin Dashboard · Early Childhood Montessori</span>
      <span><ShieldCheck size={14} /> Local workspace</span>
    </footer>
  );
}