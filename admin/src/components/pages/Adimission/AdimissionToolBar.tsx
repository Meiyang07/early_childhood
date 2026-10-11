import { Plus, RefreshCw, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROGRAMS } from "@/types/adimission";
import { admissionKeys } from "@/hook/useAdmin";

export function AdmissionToolbar({
  search,
  onSearchChange,
  program,
  onProgramChange,
  onAdd,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  program: string;
  onProgramChange: (v: string) => void;
  onAdd: () => void;
}) {
  const qc = useQueryClient();

  function handleRefresh() {
    qc.invalidateQueries({ queryKey: admissionKeys.all });
    toast.success("Refreshed");
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by child, guardian, email or phone…"
          className="pl-10"
        />
      </div>

      <Select value={program} onValueChange={onProgramChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Program" />
        </SelectTrigger>
        <SelectContent>
          {["All", ...PROGRAMS].map((p) => (
            <SelectItem key={p} value={p}>
              {p === "All" ? "All programs" : p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleRefresh}
        aria-label="Refresh"
      >
        <RefreshCw size={18} />
      </Button>

      <Button className="primary-button" onClick={onAdd}>
        <Plus size={18} />
        <span>Add application</span>
      </Button>
    </div>
  );
}