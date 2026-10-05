
import { TUITION_FEES } from '@/data/schoolDetails';
import { Container, Icon, PageBanner, SectionHeading, SiteLink } from '../Common';
import { ENROLLMENT_STEPS, FAQS } from '@/lib/constants';
import { ROUTES } from '@/routes/path';
import { JourneySection } from '../Sections';


export default function AdmissionsPage() {
  return (
    <>
      <PageBanner
        variant="blue"
        title="Admissions"
        description="Join our community and give your child a gift of Montessori education"
      />

      <section className="px-0 py-8 text-center md:py-12 px-5 md:px-12">
        <Container>
          <SectionHeading
            title="Enrollment Process"
            subtitle="Four simple steps to join our Montessori community"
          />
          <div className="mx-auto mt-10 mb-8 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-8">
            {ENROLLMENT_STEPS.map((step, index) => (
              <article key={step.title} className="flex flex-col items-center">
                <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#e8f0ff] text-[#1e6fff] transition-transform duration-300 group-hover:scale-105 md:h-[67px] md:w-[67px]">
                  <Icon name={step.icon} size={25} />
                </span>
                <strong className="text-2xl text-[#165add] md:text-[29px]">{index + 1}</strong>
                <h3 className="my-1.5 font-lora text-base font-semibold md:text-[19px]">
                  {step.title}
                </h3>
                <p className="m-0 text-xs leading-snug text-[#556175] md:text-[15px]">{step.text}</p>
              </article>
            ))}
          </div>
          <SiteLink
            to={ROUTES.ENROLL}
            className="inline-flex items-center justify-center rounded-full bg-brand-blue px-7 py-3 font-lora text-base font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg md:text-lg"
          >
            Start Your Application
          </SiteLink>
        </Container>
      </section>

      <section className="bg-[#f9fafc] py-5">
        <div className="mx-auto w-[min(100%-40px,900px)]">
          <SectionHeading
            title="Tuition &amp; Fees"
            subtitle="Transparent pricing with flexible payment options"
            className="mb-10"
          />
          <div className="overflow-x-auto rounded-2xl border border-[#e2e8f0] bg-white">
            <table className="w-full min-w-[540px] border-collapse text-left text-[13px] md:text-[15px]">
              <thead>
                <tr>
                  <th className="bg-[#eef5ff] px-5 py-4 font-medium">Program</th>
                  <th className="bg-[#eef5ff] px-5 py-4 font-medium">Monthly Tuition</th>
                </tr>
              </thead>
              <tbody>
                {TUITION_FEES.map((fee) => (
                  <tr key={fee.program}>
                    <td className="border-t border-[#e4e6eb] px-5 py-4">{fee.program}</td>
                    <td className="border-t border-[#e4e6eb] px-5 py-4">{fee.monthly}/month</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 rounded-2xl bg-[#eef5ff] px-6 py-5 text-[15px]">
            <h3 className="mb-3 font-lora text-xl font-bold">Additional Information</h3>
            <p className="mb-3">
              Contact our admissions team for fees for other programs, registration, materials, and
              payment arrangements.
            </p>
            <SiteLink
              to={ROUTES.ENROLL}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline"
            >
              Apply for enrollment <span aria-hidden="true">→</span>
            </SiteLink>
          </div>
        </div>
      </section>

      <section className="px-0 py-12">
        <div className="mx-auto w-[min(100%-40px,900px)]">
          <h2 className="mb-10 text-center font-serif text-2xl font-semibold md:text-[38px]">
            Enrollment Requirements
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="min-h-0 rounded-2xl bg-[#f8f9fc] p-6 md:min-h-[300px]">
              <h3 className="mb-3 text-[17px] font-semibold">Required Documents</h3>
              <ul className="m-0 list-none p-0">
                {[
                  'Completed enrollment application',
                  "Child's birth certificate",
                  'Current immunization records',
                  'Emergency contact information',
                  'Medical release forms',
                ].map((item) => (
                  <li
                    key={item}
                    className="mb-2 flex items-start gap-1.5 text-[15px] before:grid before:h-[17px] before:w-[17px] before:place-items-center before:rounded-full before:border-[1.5px] before:border-[#22b463] before:text-[10px] before:text-[#22b463] before:content-['✓']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-h-0 rounded-2xl bg-[#f8f9fc] p-6 md:min-h-[300px]">
              <h3 className="mb-3 text-[17px] font-semibold">Age Requirements</h3>
              <dl className="m-0">
                {[
                  ['Infant Program', '6 weeks to 18 months'],
                  ['Toddler Program', '18 months to 3 years'],
                  ['Preschool Program', '3 years to 6 years (must be potty trained)'],
                ].map(([term, def]) => (
                  <div key={term} className="mb-2">
                    <dt className="text-[15px] font-semibold">{term}</dt>
                    <dd className="m-0 text-sm">{def}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 rounded-lg bg-[#eaf2ff] p-3 text-[13px] leading-snug">
                <strong>Note:</strong> Children must meet age requirements by September 1st of the
                enrollment year.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fb] px-0 py-12">
        <div className="mx-auto w-[min(100%-40px,900px)]">
          <h2 className="mb-10 text-center font-serif text-2xl font-semibold md:text-[38px]">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-4">
            {FAQS.map(([q, a]) => (
              <article
                key={q}
                className="rounded-2xl border border-[#e4e6ed] border-b-[#d7dae2] bg-white px-6 py-5 shadow-[0_2px_0_rgba(0,0,0,0.04)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(32,47,97,0.11)]"
              >
                <h3 className="mb-2 text-[17px] font-semibold">{q}</h3>
                <p className="m-0 text-sm leading-snug text-[#556176]">{a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <JourneySection />
    </>
  );
}