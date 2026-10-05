import { cn } from '@/lib/utils';

type BannerVariant = 'pink' | 'blue';

interface PageBannerProps {
  title: string;
  description: string;
  variant?: BannerVariant;
  className?: string;
  id?: string;
}

const VARIANTS: Record<BannerVariant, string> = {
  pink: 'bg-[linear-gradient(105deg,#364b82_0%,#fff_36%,#f8d6f0_64%,#e58ed8_100%)]',
  blue: 'bg-[linear-gradient(110deg,#e49bd8_0%,#f8faff_32%,#2770ee_100%)]',
};

export function PageBanner({
  title,
  description,
  variant = 'pink',
  className,
  id,
}: PageBannerProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative isolate flex min-h-[220px] items-center justify-center overflow-hidden px-0 py-9 text-center md:min-h-[280px]',
        'bg-[length:180%_180%] animate-[gradient-shift_16s_ease-in-out_infinite_alternate] [animation-play-state:paused]',
        'ambient-active:[animation-play-state:running]',
        'before:pointer-events-none before:absolute before:-bottom-[130px] before:-left-20 before:-z-10 before:h-[220px] before:w-[220px] before:rounded-full before:bg-white/20',
        'after:pointer-events-none after:absolute after:-top-20 after:right-[6%] after:-z-10 after:h-[130px] after:w-[130px] after:rounded-full after:bg-white/15',
        VARIANTS[variant],
        className,
      )}
    >
      <div className="container">
        <h1 className="m-0 mb-3 animate-title-enter font-serif text-[clamp(2.625rem,4.25vw,3.75rem)] font-bold leading-[1.18]">
          {title}
        </h1>
        <p className="mx-auto max-w-3xl animate-title-enter text-base leading-snug [animation-delay:120ms] md:text-xl">
          {description}
        </p>
      </div>
    </section>
  );
}