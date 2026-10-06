
import { RowActions } from '@/components/Common/RowAction';
import { StaffAvatar } from '@/components/Common/StaffAvatar';
import { Status } from '@/components/Common/Status';
import type { AdminRecord } from '@/types/admin';

export function StaffGrid({
  records, onEdit, onRemove,
}: {
  records: AdminRecord[];
  onEdit: (record: AdminRecord) => void;
  onRemove: (record: AdminRecord) => void;
}) {
  return (
    <div className="staff-grid">
      {records.map((record) => (
        <article className="staff-card" key={record.id}>
          <div className="staff-card-top">
            <span className="group-tag">{record.data.group}</span>
            <Status value={record.status} />
          </div>
          <StaffAvatar record={record} />
          <h2>{record.name}</h2>
          <p>{record.data.role}</p>
          {record.data.bio && <p className="staff-bio">{record.data.bio}</p>}
          <div className="staff-card-bottom">
            <RowActions record={record} onEdit={onEdit} onRemove={onRemove} />
          </div>
        </article>
      ))}
    </div>
  );
}