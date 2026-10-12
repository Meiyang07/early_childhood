// src/pages/reviews/ReviewsPage.tsx
import { useMemo, useState } from "react";

import type { Testimonial, TestimonialStatus } from "@/types/testimonial";

import { ReviewsToolbar } from "./ReviewToolbar";
import { ReviewsSkeleton } from "./ReviewSkeleton";
import { ReviewsEmpty } from "./ReviewEmpty";
import { ReviewCard } from "./ReviewCard";
import { ReviewFormDialog } from "./ReviewFormDialoug";
import { Pagination } from "@/components/Common/Pagination";   // ⬅ NEW
import { useListTestimonials } from "@/hook/usePublic";

type StatusFilter = "All" | TestimonialStatus;

export function ReviewsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [page, setPage] = useState(1);
  const limit = 6;   // ⬅ smaller so the pager is visible with 12 records

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

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
    useListTestimonials(params);

  const testimonials = Array.isArray(data) ? data : data?.data ?? [];
  const pagination = !Array.isArray(data) ? data?.pagination : undefined;
  const hasFilters = search.trim() !== "" || status !== "All";

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setFormOpen(true);
  }

  function goToPage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="reviews-page">
      <ReviewsToolbar
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

      {isLoading && <ReviewsSkeleton count={6} />}

      {isError && (
        <div className="reviews-error" role="alert">
          <p>{error?.message ?? "Failed to load reviews."}</p>
          <button type="button" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && testimonials.length === 0 && (
        <ReviewsEmpty
          hasFilters={hasFilters}
          onClear={() => {
            setSearch("");
            setStatus("All");
            setPage(1);
          }}
          onAdd={openCreate}
        />
      )}

      {!isLoading && !isError && testimonials.length > 0 && (
        <>
          <div
            className="reviews-grid transition-opacity"
            style={{ opacity: isFetching ? 0.6 : 1 }}
          >
            {testimonials.map((t) => (
              <ReviewCard
                key={t._id}
                testimonial={t}
                onEdit={() => openEdit(t)}
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

      <ReviewFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        testimonial={editing}
      />
    </div>
  );
}