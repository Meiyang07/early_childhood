import { useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { config, kinds, validateRecord, type AdminRecord, type Kind } from '@/types/admin';
import { usePortal } from '@/lib/portal';
import { toast } from 'sonner';
import { RecordsToolbar } from './RecordsToolbar';
import { EmptyState } from '@/components/Common/EmptyState';
import { StaffGrid } from './StaffGrid';
import { GalleryGrid } from './GalleryGrid';
import { MessagesList } from './MessageLists';
import { ReviewsGrid } from './ReviewGrid';
import { RecordsTable } from './RecordsTable';
import { RecordEditor } from './RecordEditor';
import { DeleteDialog } from './DeleteDialog';


type Editor = { kind: Kind; record?: AdminRecord } | null;

export function RecordsPage() {
  const { section } = useParams<{ section: string }>();
  const kind = kinds.includes(section as Kind) ? (section as Kind) : null;
  if (!kind) return <Navigate to="/admin" replace />;

  const { data, addRecord, updateRecord, removeRecord } = usePortal();
  const [editor, setEditor] = useState<Editor>(null);
  const [remove, setRemove] = useState<AdminRecord | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [team, setTeam] = useState('All');

  if (!data) return null;

  const def = config[kind];
  const records = data.records;

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter(
      (r) =>
        r.kind === kind &&
        (filter === 'All' || r.status === filter) &&
        (kind !== 'staff' || team === 'All' || r.data.group === team) &&
        `${r.name} ${Object.values(r.data).join(' ')}`.toLowerCase().includes(q),
    );
  }, [records, kind, filter, team, search]);

  const hasFilter = search !== '' || filter !== 'All' || team !== 'All';

  async function handleSave(values: { name: string; status: string; data: Record<string, string> }) {
    const record = editor?.record;
    try {
      const valid = validateRecord(kind!, values);
      if (record) {
        updateRecord(record.id, valid);
        toast.success('Changes saved');
      } else {
        addRecord(kind!, valid);
        toast.success(`${def.singular[0].toUpperCase()}${def.singular.slice(1)} added`);
      }
      setEditor(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  function handleRemove() {
    if (!remove) return;
    removeRecord(remove.id);
    toast.success('Record removed');
    setRemove(null);
  }

  const shared = {
    onEdit: (record: AdminRecord) => setEditor({ kind, record }),
    onRemove: (record: AdminRecord) => setRemove(record),
  };

  return (
    <>
      <RecordsToolbar
        kind={kind}
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        onAdd={() => setEditor({ kind })}
        team={team}
        onTeamChange={setTeam}
      />

      <div className="records-caption">
        <span>{visible.length} {kind === 'staff' ? 'team members' : def.title.toLowerCase()}</span>
        {['admissions', 'messages', 'reviews'].includes(kind) && (
          <span>Rows marked Example contain sample data.</span>
        )}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={hasFilter ? 'No matching records' : `No ${def.title.toLowerCase()} yet`}
          description={
            hasFilter
              ? 'Try another search or filter.'
              : `Add your first ${def.singular} to get started.`
          }
          actionLabel={hasFilter ? 'Clear filters' : `Add ${def.singular}`}
          onAction={() => {
            if (hasFilter) {
              setSearch('');
              setFilter('All');
              setTeam('All');
            } else {
              setEditor({ kind });
            }
          }}
        />
      ) : kind === 'staff' ? (
        <StaffGrid records={visible} {...shared} />
      ) : kind === 'gallery' ? (
        <GalleryGrid records={visible} {...shared} />
      ) : kind === 'messages' ? (
        <MessagesList
          records={visible}
          onOpen={(record) => {
            if (record.status === 'Unread') {
              updateRecord(record.id, { name: record.name, status: 'Read', data: record.data });
            }
          }}
          {...shared}
        />
      ) : kind === 'reviews' ? (
        <ReviewsGrid
          records={visible}
          onApprove={(record) =>
            updateRecord(record.id, { name: record.name, status: 'Approved', data: record.data })
          }
          {...shared}
        />
      ) : (
        <RecordsTable kind={kind} records={visible} {...shared} />
      )}

      <p className="independent-note">Changes are saved locally on this computer.</p>

      {editor && (
        <RecordEditor
          kind={editor.kind}
          record={editor.record}
          onClose={() => setEditor(null)}
          onSave={handleSave}
        />
      )}

      <DeleteDialog
        record={remove}
        onCancel={() => setRemove(null)}
        onConfirm={handleRemove}
      />
    </>
  );
}