// src/pages/programs/ProgramsPage.tsx
import { useMemo, useState } from "react";
import type { Program, ProgramStatus } from "@/types/program";

import { ProgramsToolbar } from "./ProgramsToolbar";

import { Pagination } from "@/components/Common/Pagination";
import { useListPrograms } from "@/hook/usePublic";
import { ProgramsSkeleton } from "./ProgramSkeleton";
import { ProgramsEmpty } from "./ProgramEmptyState";
import { ProgramCard } from "./ProgramsCard";
import { ProgramFormDialog } from "./ProgramFormDialoug";

type StatusFilter = "All" | ProgramStatus;

export function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [page, setPage] = useState(1);
  const limit = 6;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);

  const params = useMemo(
    () => ({
      search: search.trim() || undefined,
      status,
      page,
      limit,
    }),
    [search, status, page],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useListPrograms(params);

  const programs = data?.data ?? [];
  const pagination = data?.pagination;
  const hasFilters = search.trim() !== "" || status !== "All";

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(p: Program) {
    setEditing(p);
    setFormOpen(true);
  }

  function goToPage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="reviews-page">
      

      <ProgramsToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        onRefresh={() => refetch()}
        isRefreshing={isFetching && !isLoading}
        onAdd={openCreate}
      />

      {isLoading && <ProgramsSkeleton count={6} />}

      {isError && (
        <div className="reviews-error" role="alert">
          <p>{error?.message ?? "Failed to load programs."}</p>
          <button type="button" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && programs.length === 0 && (
        <ProgramsEmpty
          hasFilters={hasFilters}
          onClear={() => {
            setSearch("");
            setStatus("All");
            setPage(1);
          }}
          onAdd={openCreate}
        />
      )}

      {!isLoading && !isError && programs.length > 0 && (
        <>
          <div
            className="reviews-grid transition-opacity"
            style={{ opacity: isFetching ? 0.6 : 1 }}
          >
            {programs.map((p) => (
              <ProgramCard
                key={p._id}
                program={p}
                onEdit={() => openEdit(p)}
              />
            ))}
          </div>

          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={goToPage}
              disabled={isFetching}
              windowSize={5}
              showSummary
              className="mt-6"
            />
          )}
        </>
      )}

      <ProgramFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        program={editing}
      />
    </div>
  );
}