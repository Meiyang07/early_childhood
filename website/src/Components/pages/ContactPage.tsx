import { useState, type FormEvent } from 'react';

import { SCHOOL_DETAILS } from '@/data/schoolDetails';
import { buildMailto } from '@/lib/mailto';
import { Container, Icon, PageBanner } from '../Common';
import { SCHOOL_MAP_EMBED_URL, SCHOOL_MAP_URL } from '@/lib/constants';
import { JourneySection } from '../Sections';

export default function ContactPage() {
  const [notice, setNotice] = useState('');
  const queryReason =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('reason')
      : null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const name = String(values.get('name') || '');
    const phone = String(values.get('phone') || '');
    const email = String(values.get('email') || '');
    const message = String(values.get('message') || '');
    const subject = queryReason || `Website inquiry from ${name}`;
    const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`;
    setNotice('Your email app will open with the message. Please send it there to finish.');
    window.location.href = buildMailto({ to: SCHOOL_DETAILS.email, subject, body });
  }

  return (
    <>
      <PageBanner
        title="Contact Us"
        description="We would love to hear from you. Reach out to our team anytime — we are here to help your family."
      />

      <section className=" pb-24 pt-14 flex items-center justify-center">
        <Container className="!w-[min(100%-20px,1320px)]">
          <div className="mb-16 text-center">
            <span className="inline-block rounded-full bg-brand-blue px-4 py-1.5 text-[15px] leading-snug text-white">
              Get in Touch
            </span>
            <h2 className="mb-3 mt-5 font-serif text-[clamp(2.1rem,3.8vw,3.25rem)] font-bold leading-tight text-[#263041]">
              We Would Love to Hear from You
            </h2>
            <p className="m-0 font-lora text-base leading-snug text-[#61718a] md:text-[19px]">
              Visit us at Tulsi Marg, Ranipauwa, Pokhara — or reach out anytime and we will
              respond promptly.
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
            {/* Details */}
            <div className="min-w-0">
              <img
                src="/assets/school-campus.jpg"
                alt="Early Childhood Montessori campus"
                className="mb-4 aspect-[10/3] w-full rounded-2xl object-cover object-[center_28%]"
              />

              <InfoCard
                tone="address"
                icon="pin"
                title="Address"
                body={
                  <>
                    {SCHOOL_DETAILS.address.line1}
                    <br />
                    {SCHOOL_DETAILS.address.line2}
                  </>
                }
                small={`Plus Code: ${SCHOOL_DETAILS.address.plusCode}`}
              />

              <InfoCard
                tone="phone"
                icon="phone"
                title="Phone"
                body={
                  <a href={SCHOOL_DETAILS.phoneLink} className="hover:text-brand-blue hover:underline">
                    {SCHOOL_DETAILS.phone}
                  </a>
                }
                small={`Call us ${SCHOOL_DETAILS.workingDays}, ${SCHOOL_DETAILS.workingHours}`}
              />

              <InfoCard
                tone="email"
                icon="mail"
                title="Email"
                body={
                  <a
                    href={`mailto:${SCHOOL_DETAILS.email}`}
                    className="hover:text-brand-blue hover:underline"
                  >
                    {SCHOOL_DETAILS.email}
                  </a>
                }
                small={
                  <a
                    href={`mailto:${SCHOOL_DETAILS.secondaryEmail}`}
                    className="hover:text-brand-blue hover:underline"
                  >
                    {SCHOOL_DETAILS.secondaryEmail}
                  </a>
                }
              />

              <InfoCard
                tone="hours"
                icon="clock"
                title="Working Hours"
                body={`${SCHOOL_DETAILS.workingDays}: ${SCHOOL_DETAILS.workingHours}`}
                small={SCHOOL_DETAILS.weekendClosed}
              />

              <div className="mt-2 overflow-hidden rounded-2xl">
                <iframe
                  title="Map showing Early Childhood Montessori School in Ranipauwa, Pokhara"
                  src={SCHOOL_MAP_EMBED_URL}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="block h-[215px] w-full border-0 md:h-[250px]"
                />
              </div>

              <a
                href={SCHOOL_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-full border border-brand-blue text-[13px] font-semibold transition hover:-translate-y-0.5 hover:bg-[#eaf0ff]"
              >
                <Icon name="pin" size={17} /> Open in Google Maps — Early Childhood Montessori School
              </a>
            </div>

            {/* Form */}
            <div
              id="message"
              className="min-h-[500px] scroll-mt-5 rounded-[22px] border border-[#edf0f7] bg-[#f8f9fe] p-6 md:p-8"
            >
              <h3 className="mb-1 font-lora text-2xl font-bold text-[#273246]">
                Send Us a Message
              </h3>
              <p className="mb-6 mt-0 text-[15px] text-brand-blue">
                We typically reply within one business day.
              </p>

              <form className="grid gap-5" onSubmit={submit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-[#435066]">
                    Full Name
                    <input
                      name="name"
                      required
                      placeholder="Your full name"
                      autoComplete="name"
                      className="w-full rounded-full border border-[#dbe1ea] bg-white px-4 py-3 text-sm text-[#283247] outline-none transition focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(40,60,130,0.11)]"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm font-medium text-[#435066]">
                    Phone Number
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="+977-98XXXXXXXX"
                      autoComplete="tel"
                      className="w-full rounded-full border border-[#dbe1ea] bg-white px-4 py-3 text-sm text-[#283247] outline-none transition focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(40,60,130,0.11)]"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-[#435066]">
                  Email Address
                  <input
                    name="email"
                    required
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    className="w-full rounded-full border border-[#dbe1ea] bg-white px-4 py-3 text-sm text-[#283247] outline-none transition focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(40,60,130,0.11)]"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium text-[#435066]">
                  Message
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us about your child and what you would like to know..."
                    className="min-h-[103px] w-full resize-y rounded-[18px] border border-[#dbe1ea] bg-white px-4 py-3 text-sm text-[#283247] outline-none transition focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(40,60,130,0.11)]"
                  />
                </label>
                <button
                  type="submit"
                  className="relative isolate flex min-h-[49px] items-center justify-center gap-2 overflow-hidden rounded-3xl bg-brand-blue font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:bg-brand-blue-dark hover:shadow-lg active:scale-[0.98]"
                >
                  Send Message <Icon name="send" size={18} />
                </button>
                {notice && (
                  <p role="status" className="animate-notice-enter text-sm text-[#244578]">
                    {notice}
                  </p>
                )}
              </form>

              <small className="mt-4 block text-center text-[13px] text-[#8192aa]">
                Or email us directly at{' '}
                <a href={`mailto:${SCHOOL_DETAILS.email}`} className="text-brand-blue">
                  {SCHOOL_DETAILS.email}
                </a>
              </small>
            </div>
          </div>
        </Container>
      </section>

      <JourneySection />
    </>
  );
}

const TONE_STYLES = {
  address: 'bg-[#e5f4ff] text-[#55aaf2]',
  phone: 'bg-[#edfaed] text-[#83b849]',
  email: 'bg-[#fffaf0] text-[#f4b52d]',
  hours: 'bg-[#fff0ef] text-[#fa6e4a]',
} as const;

interface InfoCardProps {
  tone: keyof typeof TONE_STYLES;
  icon: 'pin' | 'phone' | 'mail' | 'clock';
  title: string;
  body: React.ReactNode;
  small?: React.ReactNode;
}

function InfoCard({ tone, icon, title, body, small }: InfoCardProps) {
  return (
    <div className="mb-3.5 flex min-h-[88px] items-start gap-3.5 rounded-[17px] border border-[#edf0f7] bg-[#f7f9ff] px-4 py-3.5 text-[#293449]">
      <span
        className={`grid h-[42px] w-[42px] flex-none place-items-center rounded-full ${TONE_STYLES[tone]}`}
      >
        <Icon name={icon} />
      </span>
      <div>
        <h3 className="mb-0.5 text-[15px] font-semibold">{title}</h3>
        <p className="m-0 text-sm leading-snug">{body}</p>
        {small && <small className="text-xs text-[#3d4657]">{small}</small>}
      </div>
    </div>
  );
}