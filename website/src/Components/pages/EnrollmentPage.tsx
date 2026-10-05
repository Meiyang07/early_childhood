
import { SCHOOL_DETAILS, TUITION_FEES } from '@/data/schoolDetails';
import { Container, PageBanner } from '../Common';
import { EnrollmentForm } from '../Forms';
import { APPLICATION_NEXT_STEPS } from '@/lib/constants';

export default function EnrollmentPage() {
  return (
    <>
      <PageBanner
        variant="blue"
        className="!min-h-[240px]"
        title="Enroll your child"
        description="Take the first step toward a nurturing, Montessori-inspired early education. Fill out the form below and our team will reach out within two business days."
      />

      <section className="px-0 pb-8 pt-9">
        <Container className="!max-w-[1220px]">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1.9fr)_minmax(280px,1fr)] lg:gap-[clamp(32px,5.5vw,76px)]">
            <EnrollmentForm />

            <aside className="grid gap-8" aria-label="Enrollment information">
              <div className="rounded-md bg-brand-blue p-5 text-white">
                <h2 className="mb-3 font-lora text-2xl font-bold">What Happens Next</h2>
                <ol className="m-0 list-none p-0 [counter-reset:application-step]">
                  {APPLICATION_NEXT_STEPS.map((step) => (
                    <li
                      key={step}
                      className="mb-3 grid grid-cols-[21px_minmax(0,1fr)] gap-2.5 text-sm leading-relaxed last:mb-0 [counter-increment:application-step] before:mt-0.5 before:grid before:h-6 before:w-[21px] before:place-items-center before:rounded-full before:bg-white before:font-lora before:text-xs before:font-semibold before:text-brand-blue before:content-[counter(application-step)]"
                    >
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-md border border-[#f0dac5] px-5 py-4">
                <h2 className="mb-3 text-center font-lora text-2xl font-bold">
                  Tuition Quick Reference
                </h2>
                <dl className="m-0 text-base text-[#625948] md:text-[17px]">
                  {TUITION_FEES.map((fee) => (
                    <div
                      key={fee.program}
                      className="flex justify-between gap-3 border-b border-[#f2dfce] py-1.5 last:border-0"
                    >
                      <dt>{fee.program}</dt>
                      <dd className="m-0 whitespace-nowrap">{fee.monthly}/mo</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <p className="m-0 rounded-md border border-[#f6dfb6] bg-[#fff4df] px-5 py-3 text-base leading-relaxed text-[#856016]">
                Have questions before applying? Call us at{' '}
                <a href={SCHOOL_DETAILS.phoneLink} className="hover:underline">
                  {SCHOOL_DETAILS.phone}
                </a>{' '}
                or visit us during office hours: {SCHOOL_DETAILS.workingDays},{' '}
                {SCHOOL_DETAILS.workingHours}.
              </p>
            </aside>
          </div>

          <p className="mt-10 text-center text-base leading-snug">
            By submitting, you agree to be contacted by our admissions team regarding your
            application.
          </p>
        </Container>
      </section>
    </>
  );
}