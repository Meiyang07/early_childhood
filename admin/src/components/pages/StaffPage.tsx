import { useEffect, useState } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Choice } from '@/components/Common/Choice';
import { EmptyState } from '@/components/Common/EmptyState';

import { useListStaff } from '@/hook/usePublic';
import { useCreateStaff } from '@/hook/useAdmin';
import type { CreateStaffInput, StaffUser } from '@/types/staff';
import { StaffGrid } from './records/StaffGrid';
import { RecordEditor } from './records/RecordEditor';
import { DeleteDialog } from './records/DeleteDialog';

const STATUSES = ['Active', 'Inactive'];
const TEAM_TABS = ['All', 'Admins', 'Teachers', 'Operators'] as const;

export function StaffPage() {
  const qc = useQueryClient();
  const createStaff = useCreateStaff();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [remove, setRemove] = useState<StaffUser | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState('All'); // status
  const [team, setTeam] = useState('All');     // role group

  // Debounce search → server
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isFetching } = useListStaff({
    search: debouncedSearch || undefined,
    role: team !== 'All' ? team : undefined,
    status: filter !== 'All' ? filter : undefined,
  });

  const records = data?.staff ?? [];
  const counts = data?.counts ?? {
    All: 0,
    Admins: 0,
    Teachers: 0,
    Operators: 0,
  };

  const hasFilter =
    debouncedSearch !== '' || filter !== 'All' || team !== 'All';

  function refresh() {
    qc.invalidateQueries({ queryKey: ['staff'] });
    toast.success('Refreshed');
  }

  function handleSave(values: {
    name: string;
    status: string;
    data: Record<string, string>;
    image?: File | null;
  }) {
    if (!values.image) return toast.error('Please choose a photo.');
    if (!values.data.email) return toast.error('Email is required.');
    if (!values.data.password) return toast.error('Password is required.');
    if (!values.data.role) return toast.error('Role is required.');

    const payload: CreateStaffInput = {
      fullName: values.name,
      email: values.data.email,
      password: values.data.password,
      role: values.data.role,
      about: values.data.bio ?? '',
      status: values.status,
      image: values.image,
    };

    createStaff.mutate(payload, {
      onSuccess: () => {
        setEditorOpen(false);
        setEditing(null);
      },
    });
  }

  function handleRemove() {
    if (!remove) return;
    toast.error('Delete is not connected to the server yet.');
    setRemove(null);
  }

  return (
    <>
      <div className="section-toolbar">
        <div className="search-input">
          <Search size={18} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff…"
            aria-label="Search staff"
          />
        </div>

        <div className="toolbar-actions">
          <Choice
            value={filter}
            options={['All', ...STATUSES]}
            onChange={setFilter}
            label="Filter by status"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={refresh}
            aria-label="Refresh staff"
            disabled={isFetching}
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} />
          </Button>
          <Button
            className="primary-button"
            onClick={() => {
              setEditing(null);
              setEditorOpen(true);
            }}
          >
            <Plus size={18} />
            <span>Add team member</span>
          </Button>
        </div>
      </div>

      <Tabs value={team} onValueChange={setTeam} className="team-tabs">
        <TabsList>
          {TEAM_TABS.map((t) => (
            <TabsTrigger value={t} key={t}>
              {t} <span>{counts[t]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="records-caption">
        <span>
          {records.length} team member{records.length === 1 ? '' : 's'}
        </span>
      </div>

      {isLoading ? (
        <p className="independent-note">Loading team members…</p>
      ) : records.length === 0 ? (
        <EmptyState
          title={hasFilter ? 'No matching members' : 'No team members yet'}
          description={
            hasFilter
              ? 'Try another search or filter.'
              : 'Add your first team member to get started.'
          }
          actionLabel={hasFilter ? 'Clear filters' : 'Add team member'}
          onAction={() => {
            if (hasFilter) {
              setSearch('');
              setDebouncedSearch('');
              setFilter('All');
              setTeam('All');
            } else {
              setEditing(null);
              setEditorOpen(true);
            }
          }}
        />
      ) : (
        <StaffGrid
          records={records}
          onEdit={(r) => {
            setEditing(r);
            setEditorOpen(true);
          }}
          onRemove={(r) => setRemove(r)}
        />
      )}

      {editorOpen && (
        <RecordEditor
          kind="staff"
          record={
            editing
              ? {
                id: editing._id,
                kind: 'staff',
                name: editing.fullName,
                status: editing.status,
                data: {
                  role: editing.role,
                  bio: editing.about,
                  email: editing.email,
                },
                revision: 0,
                createdAt: editing.createdAt,
                updatedAt: editing.updatedAt,
              }
              : undefined
          }
          onClose={() => {
            setEditorOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}

      {remove && (
        <DeleteDialog
          record={{
            id: remove._id,
            kind: 'staff',
            name: remove.fullName,
            status: remove.status,
            data: {},
            revision: 0,
            createdAt: remove.createdAt,
            updatedAt: remove.updatedAt,
          }}
          onCancel={() => setRemove(null)}
          onConfirm={handleRemove}
        />
      )}
    </>
  );
}