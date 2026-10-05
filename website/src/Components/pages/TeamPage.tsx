import { useState } from 'react';

import type { TeamGroup } from '@/types';
import { TEAM_GROUPS, TEAM_MEMBERS } from '@/data/TeamData';
import { Container, PageBanner } from '../Common';
import { StaffCard, TeamTabs } from '../team';

function initialGroup(): TeamGroup {
  const group = new URLSearchParams(window.location.search).get('group');
  return TEAM_GROUPS.some((item) => item.id === group) ? (group as TeamGroup) : 'admins';
}

export default function TeamPage() {
  const [activeGroup, setActiveGroup] = useState<TeamGroup>(initialGroup);

  function selectGroup(group: TeamGroup, focus = false) {
    setActiveGroup(group);
    const url = new URL(window.location.href);
    url.searchParams.set('group', group);
    window.history.replaceState({}, '', url);
    if (focus) document.getElementById(`team-tab-${group}`)?.focus();
  }

  return (
    <>
      <PageBanner
        variant="pink"
        title="Our Team"
        description="The dedicated educators and staff who bring the Montessori philosophy to life for every child, every day."
      />

      <section className="pb-2.5 pt-4 px-5 md:pb-12 md:pt-8 md:px-12">
        <Container className="grid grid-cols-1 items-center gap-7 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-11">
          <div className="animate-{fade}" data-reveal>
            <h2 className="mb-5 font-lora text-[29px] font-normal leading-tight md:text-[28px] lg:text-[40px]">
              Our staff are guided by the
              <br />
              <span className="text-brand-blue">Principles</span> of –
            </h2>
            <p className="text-[15px] leading-relaxed md:text-sm lg:text-lg xl:text-[19px]">
              It is a common fact that the future of the student lies in the hands of their teacher.
              <br />
              We have a team of competent and dedicated teachers, holding a diploma in the
              Montessori method and well qualified in their respective study areas.
              <br />
              Our staff attend to each child’s individual needs and fulfill their responsibility
              properly.
              <br />
              We work together to make our school a place where we enjoy our work.
            </p>
          </div>
          <div className="justify-self-center">
            <svg
              className="h-auto w-[230px] animate-[cap-float_8s_ease-in-out_infinite] text-black md:w-[min(100%,410px)] [animation-play-state:paused] ambient-active:[animation-play-state:running]"
              viewBox="0 0 360 280"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 86 184 11l169 75-169 76L8 86Z" />
              <path d="m92 143 92 42 104-47v86l-104 47-92-45v-83Z" />
              <path d="M37 102h12v91c10 14 15 34 17 50-8 9-19 13-28 11-7 0-13-3-18-7 1-20 7-42 17-55v-90Z" />
            </svg>
          </div>
        </Container>
      </section>

      <section className="pb-16 pt-7">
        <Container>
          <div className="text-center">
            <h2 className="inline-block rounded-full bg-brand-blue px-5 py-1.5 text-[22px] font-normal leading-tight text-white md:text-[36px]">
              Get to know our team
            </h2>
            <p className="m-0 text-[23px] leading-snug md:text-[35px]">Dedicated Team Members</p>
          </div>

          <TeamTabs active={activeGroup} onSelect={selectGroup} />

          {TEAM_GROUPS.map((group) => (
            <div
              key={group.id}
              className="animate-panel-enter"
              role="tabpanel"
              id={`team-panel-${group.id}`}
              aria-labelledby={`team-tab-${group.id}`}
              hidden={activeGroup !== group.id}
              tabIndex={0}
            >
              <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-12">
                {TEAM_MEMBERS[group.id].map((member) => (
                  <StaffCard key={member.name} member={member} />
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}