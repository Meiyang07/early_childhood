import { useState } from 'react';
import type { TeamMember } from '@/types';
import { Image } from '../Common';
import { asset } from '@/lib/utils';

export function StaffCard({ member }: { member: TeamMember }) {
  const [photoUnavailable, setPhotoUnavailable] = useState(false);
  const initials = member.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

  return (
    <article className="group min-w-0 rounded-[20px] bg-[#faf6ed] px-6 py-6 text-center transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(32,47,97,0.12)] md:px-5">
      {member.image && !photoUnavailable ? (
        <Image
          src={asset(`team/${member.image}`)}
          alt={member.name}
          aspectRatio="1/1"
          fit="cover"
          fallbackSrc={asset('school-logo.jpg')}
          sizes="180px"
          className="mx-auto mb-6 w-[min(100%,125px)] rounded-full md:w-[clamp(140px,14vw,180px)]"
        />
      ) : (
        <div
          role="img"
          aria-label={`Photo unavailable for ${member.name}`}
          className="mx-auto mb-6 grid aspect-square w-[min(100%,125px)] place-items-center rounded-full bg-[#e6e8f0] text-[34px] font-medium text-brand-blue md:w-[clamp(140px,14vw,180px)] md:text-[44px]"
        >
          <span aria-hidden="true">{initials}</span>
        </div>
      )}
      <h3 className="m-0 mb-1 overflow-wrap-anywhere text-[17px] font-normal leading-tight md:text-2xl">
        {member.name}
      </h3>
      <p className="m-0 text-base font-medium leading-tight text-brand-blue md:text-2xl">
        {member.role}
      </p>
    </article>
  );
}