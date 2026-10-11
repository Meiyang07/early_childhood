import { useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { config, type AdminRecord, type Kind } from '@/types/admin';
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
};

export function RecordsPage({ kind, renderView }: Props) {
  const { data: portalData } = usePortal();
  const [editor, setEditor] = useState<Editor>(null);
  const [remove, setRemove] = useState<AdminRecord | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [team, setTeam] = useState('All');

  const source = useMemo(
    () => portalData.records.filter((r) => r.kind === kind),
    [kind, portalData.records],
  );

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return source.filter(
      (r) =>
        (filter === 'All' || r.status === filter) &&
        `${r.name} ${Object.values(r.data).join(' ')}`.toLowerCase().includes(q),
    );
  }, [source, filter, search]);

  const def = config[kind];
  const hasFilter = search !== '' || filter !== 'All';

  function handleSave() {
    toast.error('Saving this kind is not connected to the server yet.');
    setEditor(null);
  }

  function handleRemove() {
    if (!remove) return;
    toast.error('Delete is not connected to the server yet.');
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
          {visible.length} {def.title.toLowerCase()}
        </span>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={hasFilter ? 'No matching records' : `No ${def.title.toLowerCase()} yet`}
          description={
            hasFilter
              ? 'Try another search or filter.'
              : `This section is not connected to the server yet.`
          }
          actionLabel={hasFilter ? 'Clear filters' : `Add ${def.singular}`}
          onAction={() => {
            if (hasFilter) {
              setSearch('');
              setFilter('All');
            } else {
              setEditor({ kind });
            }
          }}
        />
      ) : (
        renderView(shared)
      )}

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