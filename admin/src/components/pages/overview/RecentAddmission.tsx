import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import type { AdminRecord } from '@/types/admin';
import { dateLabel } from '@/types/admin';
import { ExampleTag } from '@/components/Common/ExampleTag';
import { Status } from '@/components/Common/Status';


export function RecentAdmissions({ records }: { records: AdminRecord[] }) {
  const admissions = records
    .filter((r) => r.kind === 'admissions')
    .sort((a, b) => (b.data.date ?? '').localeCompare(a.data.date ?? ''))
    .slice(0, 5);

  return (
    <div className="recent-admissions">
      <div className="panel-heading">
        <div>
          <h2>Recent Admissions</h2>
          <p>Latest applications in your admin workspace</p>
        </div>
        <Button variant="ghost" className="view-all" asChild>
          <Link to="/admin/admissions">View all</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admissions.map((record) => (
            <TableRow key={record.id} className="admission-row">
              <TableCell>
                <span className="table-record-name">{record.name}</span>
                <ExampleTag record={record} />
              </TableCell>
              <TableCell>{record.data.program}</TableCell>
              <TableCell>{dateLabel(record.data.date)}</TableCell>
              <TableCell><Status value={record.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!admissions.length && (
        <p className="table-empty">No applications yet. Add one in Admissions.</p>
      )}
    </div>
  );
}