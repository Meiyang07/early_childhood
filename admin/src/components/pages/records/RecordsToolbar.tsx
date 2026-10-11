import { Plus, RefreshCw, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { config, type Kind } from '@/types/admin';
import { Choice } from '@/components/Common/Choice';

export function RecordsToolbar({
  kind,
  filter,
  onFilterChange,
  search,
  onSearchChange,
  onAdd,
  team,
  onTeamChange,
}: {
  kind: Kind;
  filter: string;
  onFilterChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  team: string;
  onTeamChange: (value: string) => void;
}) {
  const qc = useQueryClient();
  const def = config[kind];

  function handleRefresh() {
    qc.invalidateQueries({ queryKey: [kind] });
    toast.success('Refreshed');
  }

  return (
    <>
      <div className="section-toolbar">
        <div className="search-input">
          <Search size={18} />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search ${def.title.toLowerCase()}…`}
            aria-label={`Search ${def.title}`}
          />
        </div>

        <div className="toolbar-actions">
          <Choice
            value={filter}
            options={['All', ...def.statuses]}
            onChange={onFilterChange}
            label="Filter by status"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            aria-label="Refresh records"
          >
            <RefreshCw size={18} />
          </Button>
          <Button className="primary-button" onClick={onAdd}>
            <Plus size={18} />
            <span>Add {def.singular}</span>
          </Button>
        </div>
      </div>

      {/* team tabs intentionally removed — staff page handles its own */}
      {void team}
      {void onTeamChange}
    </>
  );
}