
import { RowActions } from '@/components/Common/RowAction';
import { Status } from '@/components/Common/Status';
import type { AdminRecord } from '@/types/admin';

export function GalleryGrid({
  records, onEdit, onRemove,
}: {
  records: AdminRecord[];
  onEdit: (record: AdminRecord) => void;
  onRemove: (record: AdminRecord) => void;
}) {
  return (
    <div className="gallery-grid">
      {records.map((record) => (
        <article className="gallery-card" key={record.id}>
          <img src={record.data.imagePath} alt={record.data.alt} loading="lazy" />
          <div className="gallery-caption">
            <div>
              <span>{record.data.category}</span>
              <h2>{record.name}</h2>
              <Status value={record.status} />
            </div>
            <RowActions record={record} onEdit={onEdit} onRemove={onRemove} />
          </div>
        </article>
      ))}
    </div>
  );
}