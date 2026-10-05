import { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { Testimonial } from '@/types';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  /** Show carousel only when items exceed this count. Default: 3 */
  minItemsForCarousel?: number;
  /** Autoplay interval in ms. Set to 0 to disable. Default: 5500 */
  autoPlayInterval?: number;
  /** Pause autoplay when the user hovers or focuses the carousel. Default: true */
  pauseOnInteraction?: boolean;
}

export function TestimonialsCarousel({
  testimonials,
  minItemsForCarousel = 3,
  autoPlayInterval = 5500,
  pauseOnInteraction = true,
}: TestimonialsCarouselProps) {
  const useCarousel = testimonials.length > minItemsForCarousel;
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ── Which slide is currently visible ── */
  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / testimonials.length;
    if (cardWidth <= 0) return;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(index, 0), testimonials.length - 1));
  }, [testimonials.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !useCarousel) return;
    el.addEventListener('scroll', updateActiveIndex, { passive: true });
    return () => el.removeEventListener('scroll', updateActiveIndex);
  }, [updateActiveIndex, useCarousel]);

  /* ── Scroll helpers ── */
  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const el = scrollRef.current;
      if (!el) return;
      const cardWidth = el.scrollWidth / testimonials.length;
      el.scrollTo({ left: cardWidth * index, behavior });
    },
    [testimonials.length],
  );

  const scrollByCard = useCallback(
    (direction: 1 | -1) => {
      const el = scrollRef.current;
      if (!el) return;
      const cardWidth = el.scrollWidth / testimonials.length;
      el.scrollBy({ left: cardWidth * direction, behavior: 'smooth' });
    },
    [testimonials.length],
  );

  /* ── Autoplay — waits for scroll to settle before scheduling next tick ── */
  useEffect(() => {
    if (!useCarousel || autoPlayInterval <= 0) return;
    if (typeof window === 'undefined') return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;

    const el = scrollRef.current;
    if (!el) return;

    /* Detect when the container has stopped scrolling */
    const waitForScrollEnd = (callback: () => void) => {
      const startLeft = el.scrollLeft;
      let settledFrames = 0;

      const check = () => {
        const delta = Math.abs(el.scrollLeft - startLeft);
        if (delta > 0.5) {
          settledFrames = 0;
        } else {
          settledFrames += 1;
        }

        if (settledFrames >= 6) {
          // ~100ms of stillness = scroll has ended
          callback();
          return;
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    };

    const advance = () => {
      if (pausedRef.current) return;

      const cardWidth = el.scrollWidth / testimonials.length;
      if (cardWidth <= 0) return;

      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const atEnd = el.scrollLeft >= maxScrollLeft - 4;

      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    };

    const schedule = () => {
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(function loop() {
        if (pausedRef.current) {
          // paused: retry after a short delay, don't lose the loop
          timerRef.current = window.setTimeout(loop, 400);
          return;
        }

        advance();

        // wait for the smooth scroll to finish before starting the next interval
        waitForScrollEnd(() => {
          timerRef.current = window.setTimeout(loop, autoPlayInterval);
        });
      }, autoPlayInterval);
    };

    schedule();

    /* Pause when the tab is hidden */
    const onVisibility = () => {
      pausedRef.current = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [useCarousel, autoPlayInterval, testimonials.length]);

  /* ── Pause / resume on hover + focus ── */
  const handleMouseEnter = () => {
    if (pauseOnInteraction) pausedRef.current = true;
  };
  const handleMouseLeave = () => {
    if (pauseOnInteraction) pausedRef.current = false;
  };
  const handleFocusIn = () => {
    if (pauseOnInteraction) pausedRef.current = true;
  };
  const handleFocusOut = () => {
    if (pauseOnInteraction) pausedRef.current = false;
  };

  /* ── Grid fallback when ≤ minItemsForCarousel ── */
  if (!useCarousel) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-9">
        {testimonials.map((t) => (
          <TestimonialCard key={t.author} testimonial={t} />
        ))}
      </div>
    );
  }

  /* ── Carousel when > minItemsForCarousel ── */
  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    >
      <div
        ref={scrollRef}
        className={cn(
          'flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4',
          '[scroll-behavior:smooth]', // ← native smooth scroll for consistency
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {testimonials.map((t) => (
          <div
            key={t.author}
            className="w-[85%] shrink-0 snap-center sm:w-[60%] md:w-[45%] lg:w-[calc((100%-2*2.25rem)/3)]"
          >
            <TestimonialCard testimonial={t} fullHeight />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => scrollByCard(-1)}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-lg text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
        >
          ←
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial slides">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                activeIndex === i ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60',
              )}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => scrollByCard(1)}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-lg text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
        >
          →
        </button>
      </div>
    </div>
  );
}

/* ── Individual card ── */
function TestimonialCard({
  testimonial,
  fullHeight = false,
}: {
  testimonial: Testimonial;
  fullHeight?: boolean;
}) {
  const { quote, author, role } = testimonial;

  return (
    <blockquote
      className={cn(
        'flex h-full flex-col rounded-2xl bg-white/[0.12] p-6 text-sm italic leading-snug text-white backdrop-blur-sm transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:bg-white/[0.16] hover:shadow-[0_10px_26px_rgba(0,0,0,0.2)] md:p-7 md:text-[17px]',
        fullHeight && 'min-h-[220px]',
      )}
    >
      <p className="mb-5 flex-1 not-italic text-white/95">“{quote}”</p>

      <footer className="mt-auto grid text-sm not-italic leading-tight">
        <strong className="font-semibold text-white">{author}</strong>
        <span className="mt-0.5 text-xs text-[#d4cae7]">{role}</span>
      </footer>
    </blockquote>
  );
}