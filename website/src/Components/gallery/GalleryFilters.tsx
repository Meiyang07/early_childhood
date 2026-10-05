
import { GALLERY_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface GalleryFiltersProps {
  active: string;
  onSelect: (value: string) => void;
}

export function GalleryFilters({ active, onSelect }: GalleryFiltersProps) {
  return (
    <div
      className="mb-7 flex flex-wrap justify-center gap-2 md:mb-10 md:gap-3.5"
      aria-label="Filter photos"
    >
      {GALLERY_CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          aria-pressed={active === category}
          className={cn(
            'rounded-full border border-[#dce1ec] bg-white  px-3 py-1 text-xs font-semibold leading-tight transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 md:px-[18px]',
            active === category
              ? 'border-brand-blue bg-brand-blue text-[#596478] shadow-[0_2px_5px_rgba(0,0,0,0.13)]'
              : 'text-[#596478]',
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}