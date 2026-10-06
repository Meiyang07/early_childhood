import { ExampleTag } from '@/components/Common/ExampleTag';
import { RowActions } from '@/components/Common/RowAction';
import { Status } from '@/components/Common/Status';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';

import { dateLabel, type AdminRecord, type Kind } from '@/types/admin';

const headers: Record<string, string[]> = {
  admissions: ['Applicant', 'Program', 'Date', 'Status', 'Actions'],
  programs: ['Program', 'Age group', 'Monthly fee', 'Status', 'Actions'],
  events: ['Title', 'Date & time', 'Location', 'Status', 'Actions'],
  blog: ['Title', 'Author', 'Date', 'Status', 'Actions'],
};

function cellValues(record: AdminRecord, kind: Kind): string[] {
  switch (kind) {
    case 'admissions':
      return [record.data.program, dateLabel(record.data.date)];
    case 'programs':
      return [record.data.age, record.data.fee ? `Rs ${Number(record.data.fee).toLocaleString()}` : 'Not set'];
    case 'events':
      return [`${dateLabel(record.data.date)} ${record.data.time ?? ''}`.trim(), record.data.location];
    case 'blog':
      return [record.data.author, dateLabel(record.data.date)];
    default:
      return [];
  }
}

export function RecordsTable({
  kind, records, onEdit, onRemove,
}: {
  kind: Kind;
  records: AdminRecord[];
  onEdit: (record: AdminRecord) => void;
  onRemove: (record: AdminRecord) => void;
}) {
  return (
    <section className="panel records-table">
      <Table>
        <TableHeader>
          <TableRow>
            {headers[kind].map((label, i) => (
              <TableHead
                key={label}
                className={i === headers[kind].length - 1 ? 'text-right' : ''}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const [second, third] = cellValues(record, kind);
            return (
              <TableRow key={record.id}>
                <TableCell>
                  <button className="table-record-name" onClick={() => onEdit(record)}>
                    {record.name}
                  </button>
                  <ExampleTag record={record} />
                  {kind === 'blog' && <p className="table-excerpt">{record.data.excerpt}</p>}
                </TableCell>
                <TableCell>{second}</TableCell>
                <TableCell>{third}</TableCell>
                <TableCell><Status value={record.status} /></TableCell>
                <TableCell><RowActions record={record} onEdit={onEdit} onRemove={onRemove} /></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}