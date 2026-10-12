// src/pages/blog/BlogPage.tsx
import { useMemo, useState } from "react";
import type { Blog, BlogStatus } from "@/types/blog";
import { useListBlogs } from "@/hook/usePublic";

import { Pagination } from "@/components/Common/Pagination";
import { BlogToolbar } from "./BlogToolbar";
import { BlogEmpty } from "./BlogEmpty";
import { BlogSkeleton } from "./BlogSkeleton";
import { BlogCard } from "./BlogCard";
import { BlogDetailsDialog } from "./BlogDetailsDialoug";
import { BlogFormDialog } from "./BlogFormDialoug";

type StatusFilter = "All" | BlogStatus;

export function BlogPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [page, setPage] = useState(1);
  const limit = 6;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);

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
    useListBlogs(params);

  const blogs = data?.data ?? [];
  const pagination = data?.pagination;
  const hasFilters = search.trim() !== "" || status !== "All";

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(blog: Blog) {
    setEditing(blog);
    setFormOpen(true);
  }

  function openDetails(blog: Blog) {
    setDetailsId(blog._id);
  }

  function goToPage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="reviews-page">
     

      <BlogToolbar
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

      {isLoading && <BlogSkeleton count={6} />}

      {isError && (
        <div className="reviews-error" role="alert">
          <p>{error?.message ?? "Failed to load blogs."}</p>
          <button type="button" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && blogs.length === 0 && (
        <BlogEmpty
          hasFilters={hasFilters}
          onClear={() => {
            setSearch("");
            setStatus("All");
            setPage(1);
          }}
          onAdd={openCreate}
        />
      )}

      {!isLoading && !isError && blogs.length > 0 && (
        <>
          <div
            className="grid grid-cols-1 gap-4 transition-opacity md:grid-cols-2 xl:grid-cols-3"
            style={{ opacity: isFetching ? 0.6 : 1 }}
          >
            {blogs.map((b) => (
              <BlogCard
                key={b._id}
                blog={b}
                onView={() => openDetails(b)}
                onEdit={() => openEdit(b)}
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

      <BlogDetailsDialog
        blogId={detailsId}
        onClose={() => setDetailsId(null)}
        onEdit={(blog) => {
          setDetailsId(null);
          openEdit(blog);
        }}
      />

      <BlogFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        blog={editing}
      />
    </div>
  );
}