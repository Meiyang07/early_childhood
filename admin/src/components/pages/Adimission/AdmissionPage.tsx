import { useMemo, useState } from "react";

import { AdmissionApplication } from "@/types/adimission";

import { useDebouncedValue } from "@/hook/useDebounced";

import { AdmissionToolbar } from "./AdimissionToolBar";
import { AdmissionStatusTabs } from "./AdmissionTabs";
import { AdmissionEmpty, AdmissionLoading } from "./AdmissionLoading";
import { AdmissionTable } from "./AdmissionTable";
import { AdmissionDetails } from "./AdmissionDetails";
import { DeleteAdmissionDialog } from "./DeleteAdmissionDialoug";
import {
  AdmissionFormModal,
  type AdmissionFormValues,
} from "./AdmissionFormModal";
import { useDeleteAdmission, useListAdimission } from "@/hook/useAdmin";
import { useCreateAdmission } from "@/hook/usePublic";

const EMPTY_COUNTS = {
  All: 0,
  Pending: 0,
  Reviewed: 0,
  Accepted: 0,
  Rejected: 0,
  Waitlisted: 0,
};

export function AdmissionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [program, setProgram] = useState("All");
  const debouncedSearch = useDebouncedValue(search, 300);

  const [viewing, setViewing] = useState<AdmissionApplication | null>(null);
  const [removing, setRemoving] = useState<AdmissionApplication | null>(null);
  const [editing, setEditing] = useState<AdmissionApplication | null>(null);
  const [creating, setCreating] = useState(false);

  const params = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: status !== "All" ? status : undefined,
      program: program !== "All" ? program : undefined,
    }),
    [debouncedSearch, status, program],
  );

  const { data, isLoading, isFetching, isError, error } =
    useListAdimission(params);
  const createMutation = useCreateAdmission();
  const deleteMutation = useDeleteAdmission();

  const applications = data?.applications ?? [];
  const counts = data?.counts ?? EMPTY_COUNTS;

  const hasFilters =
    !!debouncedSearch || status !== "All" || program !== "All";

  function clearFilters() {
    setSearch("");
    setStatus("All");
    setProgram("All");
  }

  function handleConfirmDelete() {
    if (!removing) return;
    deleteMutation.mutate(removing._id, {
      onSuccess: () => setRemoving(null),
    });
  }

  function handleCreateSubmit(values: AdmissionFormValues) {
    createMutation.mutate(
      {
        childInfo: {
          fullName: values.childInfo.fullName.trim(),
          dateOfBirth: new Date(values.childInfo.dateOfBirth).toISOString(),
          gender: values.childInfo.gender,
          applyingForProgram: values.childInfo.applyingForProgram,
        },
        guardianInfo: {
          fullName: values.guardianInfo.fullName.trim(),
          phoneNumber: values.guardianInfo.phoneNumber.trim(),
          email: values.guardianInfo.email.trim().toLowerCase(),
          homeAddress: values.guardianInfo.homeAddress.trim(),
        },
        additionalInfo: {
          previousSchool: values.additionalInfo.previousSchool.trim(),
          medicalConditions: values.additionalInfo.medicalConditions.trim(),
          referralSource: values.additionalInfo.referralSource,
        },
      },
      { onSuccess: () => setCreating(false) },
    );
  }

  function handleEditSubmit(_values: AdmissionFormValues) {
    setEditing(null);
  }

  return (
    <div className="space-y-5">
      <AdmissionToolbar
        search={search}
        onSearchChange={setSearch}
        program={program}
        onProgramChange={setProgram}
        onAdd={() => setCreating(true)}
      />

      <AdmissionStatusTabs
        value={status}
        onChange={setStatus}
        counts={counts}
      />

      <div className="records-caption flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {applications.length} application
          {applications.length === 1 ? "" : "s"}
          {isFetching && !isLoading && " · updating…"}
        </span>
      </div>

      {isLoading ? (
        <AdmissionLoading />
      ) : isError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          {(error as Error)?.message ?? "Failed to load applications."}
        </div>
      ) : applications.length === 0 ? (
        <AdmissionEmpty onClear={clearFilters} hasFilters={hasFilters} />
      ) : (
        <AdmissionTable
          applications={applications}
          onView={setViewing}
          onEdit={setEditing}
          onRemove={setRemoving}
        />
      )}

      <AdmissionDetails
        application={viewing}
        onClose={() => setViewing(null)}
      />

      <AdmissionFormModal
        open={creating}
        application={null}
        onClose={() => setCreating(false)}
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending}
      />

      <AdmissionFormModal
        open={!!editing}
        application={editing}
        onClose={() => setEditing(null)}
        onSubmit={handleEditSubmit}
        isPending={false}
      />

      <DeleteAdmissionDialog
        application={removing}
        onCancel={() => setRemoving(null)}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}