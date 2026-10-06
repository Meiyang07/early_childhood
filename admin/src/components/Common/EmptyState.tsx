import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState({
  title, description, actionLabel, onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="empty-state">
      <Inbox size={36} />
      <h2>{title}</h2>
      <p>{description}</p>
      <Button variant="outline" onClick={onAction}>{actionLabel}</Button>
    </div>
  );
}