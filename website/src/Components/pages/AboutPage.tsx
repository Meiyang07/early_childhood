
import { asset } from '@/lib/utils';
import { Container, Icon, SectionHeading } from '../Common';
import { JourneySection } from '../Sections';

export default function AboutPage() {
  return (
    <>
      <section className="bg-brand-cream py-14 md:py-20">
        <Container>
          <SectionHeading
            title="About Early Childhood Montessori &amp; Academy"
            subtitle="Dedicated to providing quality early childhood education in Ranipauwa, Pokhara-11 since 2005."
            as="h1"
            showLine
            className="mb-12"
          />

          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-11 px-5 md:px-12">
            <img
              src={asset('school-campus.jpg')}
              alt="Early Childhood Montessori school building and courtyard"
              className="w-full rounded-2xl object-contain shadow-[0_12px_22px_rgba(0,0,0,0.13)]"
            />
            <div>
              <p className="mb-5 text-[15px] leading-relaxed md:text-lg">
                Early Childhood Montessori &amp; Academy is dedicated to providing quality early
                childhood education. We believe that children learn best through exploration,
                creativity, and meaningful experiences.
              </p>
              <p className="mb-5 text-[15px] leading-relaxed md:text-lg">
                Our Montessori-inspired curriculum encourages children to become independent
                thinkers while developing respect, responsibility, and compassion. We strive to
                create a nurturing environment where every child feels loved, respected, and
                inspired to reach their full potential.
              </p>
              <p className="text-[15px] leading-relaxed md:text-lg">
                Our child-friendly educational approach (
                <strong className="text-brand-blue">बालमैत्री वातावरण शिक्षा</strong>) helps
                children develop academically, socially, emotionally, and physically through
                hands-on experiences.
              </p>
            </div>
          </div>


          {/* our mission and vision section */}
          <div className="mt-12 grid grid-cols-1 gap-5 md:mt-20 lg:grid-cols-2 lg:gap-9 px-5 md:px-12">
            <article className="min-h-0 rounded-[17px] bg-brand-blue p-7 font-lora text-[15px] leading-snug text-white md:min-h-[300px] md:p-9 md:text-[19px]">
              <h2 className="mb-5 flex items-center gap-3.5 font-serif text-[25px] font-bold md:text-[29px]">
                <Icon name="sun" size={30} /> Our Vision
              </h2>
              <p className="m-0">
                To become a leading child-centered educational institution that inspires young
                learners to become confident, responsible, and lifelong learners.
              </p>
            </article>
            <article className="min-h-0 rounded-[17px] bg-[#4b586a] p-7 font-lora text-[15px] leading-snug text-white md:min-h-[300px] md:p-9 md:text-[19px]">
              <h2 className="mb-5 flex items-center gap-3.5 font-serif text-[25px] font-bold md:text-[29px]">
                <Icon name="leaf" size={30} /> Our Mission
              </h2>
              <ul className="m-0 list-none p-0">
                {[
                  'Provide quality Montessori education',
                  'Foster creativity and critical thinking',
                  "Develop children's social and emotional skills",
                  'Build strong partnerships with parents',
                  'Create a safe and inclusive learning environment',
                ].map((item) => (
                  <li key={item} className="my-2 flex gap-3 before:font-bold before:text-[#e2e8f1] before:content-['✓']">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </Container>
      </section>
      <JourneySection secondary="Admission Info" />
    </>
  );
}