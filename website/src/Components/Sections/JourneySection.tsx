import { Container, SiteLink } from "../Common";


interface JourneySectionProps {
  secondary?: 'Email Us' | 'Admission Info';
}

export function JourneySection({ secondary = 'Email Us' }: JourneySectionProps) {
  return (
    <section className="relative isolate min-h-0 overflow-hidden bg-brand-pale px-0 py-14 text-center [background-image:linear-gradient(110deg,#dfe2ec,#edf0f8_48%,#e6e1ef)] [background-size:180%_180%] md:min-h-[335px] md:py-16 animate-[gradient-shift_16s_ease-in-out_infinite_alternate] [animation-play-state:paused] ambient-active:[animation-play-state:running]">
      <div className="pointer-events-none absolute -left-24 -top-32 -z-10 h-[230px] w-[230px] rounded-full bg-[#b9c4e7]/20" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 -z-10 h-[180px] w-[180px] rounded-full bg-[#e0afda]/25" />
      <Container>
        <h2 className="mb-5 font-serif text-[27px] font-medium leading-tight md:text-[38px]">
          Ready To Begin Your Journey?
        </h2>
        <p className="mb-6 text-sm font-medium text-brand-blue md:text-base">
          Schedule a tour of our school and see the Montessori method in action
        </p>
        <div className="flex flex-wrap justify-center gap-2.5 md:gap-6">
          <SiteLink
            to="/contact?reason=School%20visit#message"
            className="inline-flex min-w-0 items-center justify-center rounded-full bg-brand-blue px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg md:min-w-[220px] md:px-7 md:text-lg"
          >
            Schedule a visit
          </SiteLink>
          {secondary === 'Admission Info' ? (
            <SiteLink
              to="/admissions"
              className="inline-flex min-w-0 items-center justify-center rounded-full bg-[#f3ede8] px-4 py-3 text-sm font-medium text-[#151515] transition hover:-translate-y-0.5 hover:shadow-lg md:min-w-[220px] md:px-7 md:text-lg"
            >
              Admission Info
            </SiteLink>
          ) : (
            <a
              href="mailto:mail@earlychildhood.edu.np"
              className="inline-flex min-w-0 items-center justify-center rounded-full bg-[#f3ede8] px-4 py-3 text-sm font-medium text-[#151515] transition hover:-translate-y-0.5 hover:shadow-lg md:min-w-[220px] md:px-7 md:text-lg"
            >
              Email Us
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}