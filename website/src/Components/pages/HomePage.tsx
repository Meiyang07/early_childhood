
import { asset } from '@/lib/utils';

import { FEATURES, TESTIMONIALS, WELCOME_PHOTOS } from '@/lib/constants';
import { JourneySection, ProgramCards, TestimonialsCarousel } from '../Sections';
import { Container, Icon, SectionHeading, SiteLink } from '../Common';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[470px] items-center justify-center overflow-hidden bg-[linear-gradient(95deg,rgba(226,136,181,0.68)_0%,rgba(164,151,194,0.66)_52%,rgba(63,90,146,0.66)_100%)] text-center md:min-h-[575px] lg:min-h-[695px]">
        <div
          className="absolute -inset-[1%] -z-20 animate-hero-drift bg-cover bg-center [animation-play-state:paused] ambient-active:[animation-play-state:running]"
          style={{ backgroundImage: `url(${asset('home-hero.webp')})` }}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,rgba(226,136,181,0.68),rgba(164,151,194,0.66)_52%,rgba(63,90,146,0.66))]" />
        <Container className="relative z-10 pb-4">
          <h1 className="mb-4 animate-title-enter font-serif text-[clamp(44px,11vw,88px)] font-bold leading-[1.1] tracking-tight">
            Nurturing Curious Minds
          </h1>
          <p className="mb-8 animate-title-enter font-serif text-[clamp(22px,3vw,40px)] font-bold leading-tight text-white [animation-delay:130ms]">
            Discover the Montessori difference for your child's early year
          </p>
          <div className="flex flex-wrap justify-center gap-3.5 animate-title-enter [animation-delay:260ms]">
            <SiteLink
              to="/contact?reason=School%20visit#message"
              className="inline-flex items-center justify-center rounded-[10px] bg-white px-5 py-2.5 font-serif text-[17px] font-bold text-brand-blue transition hover:-translate-y-0.5 hover:shadow-lg md:text-2xl"
            >
              Schedule a Visit
            </SiteLink>
            <SiteLink
              to="/programs"
              className="inline-flex items-center justify-center rounded-[10px] border-2 border-[#12328a] bg-transparent px-5 py-2.5 font-serif text-[17px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10 md:text-2xl"
            >
              Our Programs
            </SiteLink>
          </div>
        </Container>
      </section>

      {/* Quote */}
      <section className="bg-brand-cream py-12 md:py-20 px-5 md:px-10">
        <Container>
          <h2 className="mb-8 text-center font-serif text-[clamp(2rem,4.3vw,3.7rem)] font-bold leading-tight text-brand-blue md:mb-24">
            Early Childhood Montessori &amp; Academy
          </h2>
          <div className="mx-auto grid max-w-[1190px] grid-cols-1 items-center gap-5 lg:grid-cols-[1fr_245px] lg:gap-16">
            <div>
              <p className="mb-4 text-lg font-semibold italic text-[#ed2929] md:text-[27px]">
                “Radiance on undiscovered movement”
              </p>
              <blockquote className="mb-3 max-w-[900px] text-sm leading-snug text-[#26323d] md:text-[23px] text-justify">
                "ECEC Montessori gives, your child a strong basis in the most formative and
                important years for developing into a responsible happy and fulfilled person."
              </blockquote>
              <strong className="text-xs md:text-base">
                • &nbsp;Dr.Maria Montessori (1870 AD - 1952 AD)
              </strong>
            </div>
            <img
              src={asset('montessori-portrait.png')}
              alt="Portrait of Maria Montessori"
              className="mx-auto w-[98px] justify-self-center object-contain md:w-full"
            />
          </div>
        </Container>
      </section>

      {/* Welcome */}
      <section className="md:px-20 px-5 py-12 md:py-16">
        <Container>
          <h2 className="mb-10 text-center text-[27px] font-medium md:mb-20 md:text-[34px]">
            Welcome to Early Childhood Montessori
          </h2>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="text-[15px] leading-snug text-brand-blue md:text-lg">
              <p className="mb-5">
                For over 25 years, we've been providing exceptional Montessori education to
                children from infancy through kindergarten. Our carefully prepared environments
                encourage independence, creativity, and a lifelong love of learning.
              </p>
              <p className="mb-5">
                Founded on the principles of Dr. Maria Montessori, we believe in respecting each
                child as a unique individual and supporting their natural development through
                hands-on exploration and discovery.
              </p>
              <SiteLink
                to="/about"
                className="inline-flex items-center justify-center rounded-[7px] bg-brand-blue px-7 py-3 text-base font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg md:text-lg"
              >
                Learn More about us
              </SiteLink>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              {WELCOME_PHOTOS.map((photo) => (
                <div
                  key={photo.image}
                  className="group relative overflow-hidden rounded-2xl bg-[#f1f4f8] transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(32,47,97,0.12)]"
                >
                  <img
                    src={asset(photo.image)}
                    alt={photo.alt}
                    style={{ objectPosition: photo.position }}
                    loading="lazy"
                    decoding="async"
                    className="h-[135px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.06] md:h-[175px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>




      {/* Features */}
      <section className="bg-[#e8efff] pb-16 pt-12 px-10">
        <Container>
          <SectionHeading
            title="Why Choose Montessori?"
            subtitle="Our approach fosters independence, confidence, and a natural love of learning"
            className="mb-9 md:mb-14"
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-9">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="group relative isolate min-h-0 rounded-[14px] bg-white p-6 shadow-[0_1px_1px_rgba(123,140,168,0.13)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(32,47,97,0.12)] md:min-h-[220px] md:px-7"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[9px] bg-[#e1ecff] text-[#2468eb] transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-[7deg]">
                  <Icon name={feature.icon} size={22} />
                </span>
                <h3 className="mb-2 mt-5 text-lg font-semibold text-[#27313b]">
                  {feature.title}
                </h3>
                <p className="m-0 text-[15px] leading-snug text-[#526071]">{feature.detail}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Programs */}
      <section className="md:px-10 px-5 pb-16 pt-12 md:pb-24 md:pt-14">
        <Container>
          <SectionHeading
            title="Our Programs"
            subtitle="Age appropriate environments designed for optimal development"
            className="mb-9 md:mb-20"
          />
          <ProgramCards />
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-[linear-gradient(115deg,#263d88,#4c1789)] py-12 text-white md:py-16 md:px-10 px-5">
        <Container>
          <SectionHeading
            title="What Parents Say"
            subtitle="Hear from the families who've experienced the Montessori difference"
            className="mb-9 md:mb-20 [&_p]:text-white/80"
          />
          <TestimonialsCarousel testimonials={TESTIMONIALS} />
        </Container>
      </section>

      <JourneySection secondary="Admission Info" />
    </>
  );
}