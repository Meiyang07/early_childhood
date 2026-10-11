import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Status } from '@/components/Common/Status';
import type { StaffUser } from '@/types/staff';

function initials(name: string) {
  return name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const roleToGroup: Record<string, string> = {
  ADMINS: 'Admins',
  TEACHER: 'Teachers',
  OPERATOR: 'Operators',
};

export function StaffGrid({
  records,
  onEdit,
  onRemove,
}: {
  records: StaffUser[];
  onEdit: (record: StaffUser) => void;
  onRemove: (record: StaffUser) => void;
}) {
  return (
    <div className="staff-grid">
      {records.map((record) => (
        <article className="staff-card" key={record._id}>
          <div className="staff-card-top">
            <span className="group-tag">
              {roleToGroup[record.role] ?? record.role}
            </span>
            <Status value={record.status} />
          </div>

          <div className="staff-avatar">
            {record.image ? (
              <img
                src={record.image}
                alt={record.fullName}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              initials(record.fullName)
            )}
          </div>

          <h2>{record.fullName}</h2>
          <p>{record.role}</p>
          {record.email && <p className="staff-email">{record.email}</p>}
          {record.about && <p className="staff-bio">{record.about}</p>}

          <div className="staff-card-bottom">
            <div className="row-actions">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${record.fullName}`}
                onClick={() => onEdit(record)}
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="remove-button"
                aria-label={`Remove ${record.fullName}`}
                onClick={() => onRemove(record)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}