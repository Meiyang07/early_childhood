import { useEffect, useState } from 'react';
import type { AdminRecord } from '@/types/admin';

export function StaffAvatar({ record }: { record: AdminRecord }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [record.data.imagePath]);

  const initials = record.name.split(' ').map((s) => s[0]).slice(0, 2).join('');

  return (
    <div className="staff-avatar">
      {record.data.imagePath && !failed ? (
        <img
          src={record.data.imagePath}
          alt={record.name}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
}