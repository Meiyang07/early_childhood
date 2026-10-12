// src/pages/gallery/GalleryGrid.tsx
import type { Photo } from "@/types/photo";
import { GalleryCard } from "./GalleryCard";


export function GalleryGrid({
  photos,
  onOpen,
  onEdit,
  dimmed = false,
}: {
  photos: Photo[];
  onOpen: (index: number) => void;
  onEdit: (photo: Photo) => void;
  dimmed?: boolean;
}) {
  return (
    <div
      className="grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      style={{ opacity: dimmed ? 0.6 : 1 }}
    >
      {photos.map((photo, i) => (
        <GalleryCard
          key={photo._id}
          photo={photo}
          onOpen={() => onOpen(i)}
          onEdit={() => onEdit(photo)}
        />
      ))}
    </div>
  );
}