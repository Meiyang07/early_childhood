
import { SCHOOL_DETAILS } from '@/data/schoolDetails';

import { FOOTER_PROGRAM_LINKS, FOOTER_QUICK_LINKS, SCHOOL_MAP_URL, SITE_NAME } from '@/lib/constants';
import { Brand, Container, Icon, SiteLink } from '../Common';





export function Footer() {
  return (
    <footer className="bg-brand-navy py-9 text-[#d6d9de] md:px-12 px-5">
      <Container>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-[2.05fr_1fr_1.4fr_1.45fr] lg:gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Brand light />
            <p className="mt-4 max-w-[310px] font-lora text-[13px] leading-snug">
              Nurturing curious minds through child-centered Montessori education.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {FOOTER_QUICK_LINKS.map((item) => (
                <li key={item.path}>
                  <SiteLink
                    to={item.path}
                    className="block text-[11px] leading-tight text-[#b7beca] transition hover:translate-x-1 hover:text-white lg:text-[13px]"
                  >
                    {item.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Programs</h3>
            <ul className="space-y-2">
              {FOOTER_PROGRAM_LINKS.map((item) => (
                <li key={item.path}>
                  <SiteLink
                    to={item.path}
                    className="block text-[11px] leading-tight text-[#b7beca] transition hover:translate-x-1 hover:text-white lg:text-[13px]"
                  >
                    {item.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Contact</h3>
            <ul className="space-y-2 text-[11px] leading-tight text-[#b7beca] lg:text-[13px]">
              <li>
                <a
                  href={SCHOOL_MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2 transition hover:text-white"
                >
                  <Icon name="pin" size={16} />
                  {SCHOOL_DETAILS.address.short}
                </a>
              </li>
              <li>
                <a href={SCHOOL_DETAILS.phoneLink} className="flex gap-2 transition hover:text-white">
                  <Icon name="phone" size={16} />
                  {SCHOOL_DETAILS.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SCHOOL_DETAILS.email}`}
                  className="flex gap-2 transition hover:text-white"
                >
                  <Icon name="mail" size={16} />
                  {SCHOOL_DETAILS.email}
                </a>
              </li>
              <li className="flex gap-2">
                <Icon name="clock" size={16} />
                <span>
                  {SCHOOL_DETAILS.workingDays}
                  <br />
                  {SCHOOL_DETAILS.workingHours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-7 border-t border-[#8a8f96] pt-5 text-center text-[11px] text-[#bec2ca] lg:text-sm">
          {SITE_NAME.copyright}
        </div>
      </Container>
    </footer>
  );
}