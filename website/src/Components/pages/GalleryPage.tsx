import { useMemo, useState } from 'react';

import { GALLERY_ITEMS } from '@/data/galleryData';
import type { GalleryItem } from '@/types';
import { FEATURED_GALLERY_IMAGES } from '@/lib/constants';
import { Container, PageBanner } from '../Common';
import { GalleryFilters, GalleryGrid, Lightbox } from '../gallery';
import { JourneySection } from '../Sections';

const featured = new Set<string>(FEATURED_GALLERY_IMAGES);
const tiles: GalleryItem[] = [
  ...FEATURED_GALLERY_IMAGES.map(
    (image) => GALLERY_ITEMS.find((item) => item.image === image)!,
  ).filter(Boolean),
  ...GALLERY_ITEMS.filter((item) => !featured.has(item.image)),
];

export default function GalleryPage() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const visible = useMemo(
    () => tiles.filter((item) => filter === 'All' || item.categories.includes(filter)),
    [filter],
  );

  const selectedIndex = selected
    ? visible.findIndex((item) => item.image === selected.image)
    : -1;

  function showAdjacent(step: number) {
    if (selectedIndex >= 0) {
      setSelected(visible[(selectedIndex + step + visible.length) % visible.length]);
    }
  }

  return (
    <>
      <PageBanner
        title="Our Gallery"
        description="A window into the vibrant, joyful, and purposeful daily life at Early Childhood Education Centre."
      />

      <section className="px-0 pb-6 pt-5 flex items-center justify-center">
        <Container className="!w-[min(100%-24px,1320px)]">
          <GalleryFilters
            active={filter}
            onSelect={(value) => {
              setFilter(value);
              setSelected(null);
            }}
          />
          <GalleryGrid items={visible} activeFilter={filter} onSelect={setSelected} />
        </Container>
      </section>

      {selected && (
        <Lightbox
          item={selected}
          index={selectedIndex}
          total={visible.length}
          onClose={() => setSelected(null)}
          onPrev={() => showAdjacent(-1)}
          onNext={() => showAdjacent(1)}
        />
      )}

      <JourneySection secondary="Admission Info" />
    </>
  );
}