import type { AdminRecord } from '@/types/admin';

export function ExampleTag({ record }: { record: AdminRecord }) {
  return record.data.example === 'true' ? <span className="example-tag">Example</span> : null;
}