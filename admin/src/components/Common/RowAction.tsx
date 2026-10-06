import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdminRecord } from '@/types/admin';

export function RowActions({
  record, onEdit, onRemove,
}: {
  record: AdminRecord;
  onEdit: (record: AdminRecord) => void;
  onRemove: (record: AdminRecord) => void;
}) {
  return (
    <div className="row-actions">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Edit ${record.name}`}
        onClick={() => onEdit(record)}
      >
        <Pencil size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="remove-button"
        aria-label={`Remove ${record.name}`}
        onClick={() => onRemove(record)}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}