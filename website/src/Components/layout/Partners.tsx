
import { asset } from '@/lib/utils';

import { PARTNER_LOGOS } from '@/lib/constants';
import { Container } from '../Common';

export function Partners() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[linear-gradient(90deg,#dcfffc_0%,#fff_50%,#dafffb_100%)] py-8 text-center [background-size:180%_180%] animate-[gradient-shift_16s_ease-in-out_infinite_alternate] [animation-play-state:paused] ambient-active:[animation-play-state:running]"
      aria-label="Partnered with Pocomat"
    >
      <Container>
        <h2 className="mb-1 font-serif text-[clamp(2rem,3.8vw,3.2rem)] font-normal leading-tight">
          Partnered with
        </h2>
        <div className="flex items-center justify-center gap-7 sm:gap-[clamp(28px,5vw,72px)]">
          {PARTNER_LOGOS.map((logo) => (
            <a
              key={logo.href}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={logo.ariaLabel}
              className="inline-flex items-center justify-center transition-[translate,rotate,filter] duration-300 hover:-translate-y-1.5 hover:-rotate-3 hover:drop-shadow-[0_8px_12px_rgba(40,60,130,0.17)]"
            >
              <img
                src={asset(logo.src)}
                alt={logo.alt}
                className="h-[60px] w-[60px] rounded-full bg-white object-contain sm:h-[clamp(60px,5.8vw,78px)] sm:w-[clamp(60px,5.8vw,78px)]"
                loading="lazy"
                decoding="async"
              />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}