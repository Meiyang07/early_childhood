
import { usePortal } from '@/lib/portal';
import { RecordsPage } from './records/RecordsPage';
import { ReviewsGrid } from './records/ReviewGrid';

export function ReviewsPage() {
  const { updateRecord } = usePortal();
  return (
    <RecordsPage
      kind="reviews"
      renderView={(props) => (
        <ReviewsGrid
          {...props}
          onApprove={(record) =>
            updateRecord(record.id, {
              name: record.name,
              status: 'Approved',
              data: record.data,
            })
          }
        />
      )}
    />
  );
}