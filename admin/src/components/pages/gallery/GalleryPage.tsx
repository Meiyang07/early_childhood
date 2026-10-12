// src/pages/gallery/GalleryPage.tsx
import { useMemo, useState } from "react";
import type { Photo, PhotoCategory, PhotoStatus } from "@/types/photo";
import { useListPhotos } from "@/hook/usePublic";

import { Pagination } from "@/components/Common/Pagination";
import { GalleryToolbar } from "./GalleryToolbar";
import { GallerySkeleton } from "./GallerySkeleton";
import { GalleryEmpty } from "./GalleryEmpty";
import { GalleryGrid } from "./GalleryGrid";
import { GalleryLightbox } from "./GalleryLightBox";
import { PhotoFormDialog } from "./PhotoFormDialoug";

type CategoryFilter = "All" | PhotoCategory;
type StatusFilter = "All" | PhotoStatus;

export function GalleryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [page, setPage] = useState(1);
  const limit = 12;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Photo | null>(null);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const params = useMemo(
    () => ({
      search: search.trim() || undefined,
      category,
      status,
      page,
      limit,
    }),
    [search, category, status, page],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useListPhotos(params);

  const photos = data?.data ?? [];
  const pagination = data?.pagination;
  const hasFilters =
    search.trim() !== "" || category !== "All" || status !== "All";

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(photo: Photo) {
    setEditing(photo);
    setFormOpen(true);
  }

  function goToPage(next: number) {
    setPage(next);
    setLightboxIndex(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openLightbox(index: number) {
    setLightboxIndex(index);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function nextPhoto() {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % photos.length,
    );
  }

  function prevPhoto() {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + photos.length) % photos.length,
    );
  }

  return (
    <div className="reviews-page">
    

      <GalleryToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        category={category}
        onCategoryChange={(v) => {
          setCategory(v);
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

      {isLoading && <GallerySkeleton count={6} />}

      {isError && (
        <div className="reviews-error" role="alert">
          <p>{error?.message ?? "Failed to load photos."}</p>
          <button type="button" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && photos.length === 0 && (
        <GalleryEmpty
          hasFilters={hasFilters}
          onClear={() => {
            setSearch("");
            setCategory("All");
            setStatus("All");
            setPage(1);
          }}
          onAdd={openCreate}
        />
      )}

      {!isLoading && !isError && photos.length > 0 && (
        <>
          <GalleryGrid
            photos={photos}
            onOpen={(i) => openLightbox(i)}
            onEdit={openEdit}
            dimmed={isFetching}
          />

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

      {/* Lightbox */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <GalleryLightbox
          photos={photos}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextPhoto}
          onPrev={prevPhoto}
          onEdit={(photo) => {
            closeLightbox();
            openEdit(photo);
          }}
        />
      )}

      {/* Add / Edit */}
      <PhotoFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        photo={editing}
      />
    </div>
  );
}