import { useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { config, validateRecord, type AdminRecord, type Kind } from '@/types/admin';
import { usePortal } from '@/lib/portal';
import { EmptyState } from '@/components/Common/EmptyState';
import { RecordsToolbar } from './RecordsToolbar';
import { RecordEditor } from './RecordEditor';
import { DeleteDialog } from './DeleteDialog';

type Editor = { kind: Kind; record?: AdminRecord } | null;

type SharedProps = {
  records: AdminRecord[];
  onEdit: (record: AdminRecord) => void;
  onRemove: (record: AdminRecord) => void;
};

type Props = {
  kind: Kind;
  renderView: (props: SharedProps) => ReactNode;
  onApprove?: (record: AdminRecord) => void;   // reviews only
  onOpen?: (record: AdminRecord) => void;      // messages only
};

export function RecordsPage({ kind, renderView, onApprove, onOpen }: Props) {
  const { data, addRecord, updateRecord, removeRecord } = usePortal();
  const [editor, setEditor] = useState<Editor>(null);
  const [remove, setRemove] = useState<AdminRecord | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [team, setTeam] = useState('All');

  const visible = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    return data.records.filter(
      (r) =>
        r.kind === kind &&
        (filter === 'All' || r.status === filter) &&
        (kind !== 'staff' || team === 'All' || r.data.group === team) &&
        `${r.name} ${Object.values(r.data).join(' ')}`.toLowerCase().includes(q),
    );
  }, [data, kind, filter, team, search]);

  if (!data) return null;

  const def = config[kind];
  const hasFilter = search !== '' || filter !== 'All' || team !== 'All';

  function handleSave(values: { name: string; status: string; data: Record<string, string> }) {
    try {
      const valid = validateRecord(kind, values);
      if (editor?.record) {
        updateRecord(editor.record.id, valid);
        toast.success('Changes saved');
      } else {
        addRecord(kind, valid);
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

 const shared: SharedProps = {
  records: visible,
  onEdit: (record) => setEditor({ kind, record }),
  onRemove: (record) => setRemove(record),
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
        <span>
          {visible.length} {kind === 'staff' ? 'team members' : def.title.toLowerCase()}
        </span>
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
      ) : (
        renderView(shared)
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