import { asset, cn } from '@/lib/utils';
import type { GalleryItem } from '@/types';
import { Image } from '../Common';

interface GalleryGridProps {
  items: GalleryItem[];
  activeFilter: string;
  onSelect: (item: GalleryItem) => void;
}

export function GalleryGrid({ items, activeFilter, onSelect }: GalleryGridProps) {
  return (
    <div
      className="grid grid-cols-2 gap-2.5 animate-panel-enter md:gap-3 lg:grid-cols-3"
      key={activeFilter}
    >
      {items.map((item) => (
        <button
          key={item.image}
          type="button"
          onClick={() => onSelect(item)}
          aria-label={`View photo: ${item.alt}`}
          className={cn(
            'group relative isolate aspect-[1.25] overflow-hidden rounded-2xl border-0 bg-[#e4e9ee] p-0 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(32,47,97,0.17)] lg:aspect-[1.78]',
            item.portrait && 'lg:row-span-2 lg:aspect-[1.25] lg:aspect-auto',
          )}
        >
          <Image
            src={asset(item.image)}
            alt={item.alt}
            aspectRatio="16/9"
            fit="cover"
            placeholder="blur"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="h-full w-full"
          />
          <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white px-2.5 py-0.5 text-[9px] font-semibold text-[#58616b] shadow-[0_1px_3px_rgba(0,0,0,0.13)] transition-[translate,background-color] duration-300 group-hover:-translate-y-1 group-hover:bg-[#fffaf4] lg:bottom-2.5 lg:left-2.5 lg:px-3 lg:text-xs">
            {activeFilter === 'All' ? item.categories[0] : activeFilter}
          </span>
        </button>
      ))}
    </div>
  );
}