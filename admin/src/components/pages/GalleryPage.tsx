import { GalleryGrid } from "./records/GalleryGrid";
import { RecordsPage } from "./records/RecordsPage";


export function GalleryPage() {
  return (
    <RecordsPage
      kind="gallery"
      renderView={(props) => <GalleryGrid {...props} />}
    />
  );
}