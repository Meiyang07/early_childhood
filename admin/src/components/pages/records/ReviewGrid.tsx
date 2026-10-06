import { Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { dateLabel, type AdminRecord } from '@/types/admin';
import { Status } from '@/components/Common/Status';
import { ExampleTag } from '@/components/Common/ExampleTag';
import { RowActions } from '@/components/Common/RowAction';

export function ReviewsGrid({
  records, onApprove, onEdit, onRemove,
}: {
  records: AdminRecord[];
  onApprove: (record: AdminRecord) => void;
  onEdit: (record: AdminRecord) => void;
  onRemove: (record: AdminRecord) => void;
}) {
  return (
    <div className="reviews-grid">
      {records.map((record) => (
        <article className="review-card" key={record.id}>
          <div className="review-top">
            <span className="review-stars" aria-label={`${record.data.rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={17}
                  fill={i < Number(record.data.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </span>
            <Status value={record.status} />
          </div>
          <blockquote>{record.data.body}</blockquote>
          <p className="review-author">
            {record.name} <ExampleTag record={record} />
          </p>
          <div className="review-bottom">
            <span>{dateLabel(record.data.date)}</span>
            <div className="row-actions">
              {record.status === 'Pending' && (
                <Button variant="outline" onClick={() => onApprove(record)}>
                  <Check size={16} /> Approve
                </Button>
              )}
              <RowActions record={record} onEdit={onEdit} onRemove={onRemove} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}