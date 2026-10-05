import type { KeyboardEvent } from 'react';

import { cn } from '@/lib/utils';
import type { TeamGroup } from '@/types';
import { TEAM_GROUPS } from '@/data/TeamData';

interface TeamTabsProps {
  active: TeamGroup;
  onSelect: (group: TeamGroup, focus?: boolean) => void;
}

export function TeamTabs({ active, onSelect }: TeamTabsProps) {
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % TEAM_GROUPS.length;
    else if (event.key === 'ArrowLeft') next = (index + TEAM_GROUPS.length - 1) % TEAM_GROUPS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = TEAM_GROUPS.length - 1;
    else return;
    event.preventDefault();
    onSelect(TEAM_GROUPS[next].id, true);
  }

  return (
    <div
      className="my-8 flex items-center justify-center gap-1 md:my-10 md:gap-4 lg:gap-16"
      role="tablist"
      aria-label="Team groups"
    >
      {TEAM_GROUPS.map((group, index) => (
        <button
          key={group.id}
          type="button"
          id={`team-tab-${group.id}`}
          role="tab"
          aria-selected={active === group.id}
          aria-controls={`team-panel-${group.id}`}
          tabIndex={active === group.id ? 0 : -1}
          onClick={() => onSelect(group.id)}
          onKeyDown={(event) => onKeyDown(event, index)}
          className={cn(
            'min-h-[44px] rounded-full border-0 px-4 py-2 text-[17px] leading-tight transition-all duration-200 md:min-w-[120px] md:px-5 md:text-[21px] lg:min-w-[144px] lg:text-2xl',
            active === group.id
              ? 'bg-brand-blue text-white shadow-[0_4px_12px_rgba(40,60,130,0.11)]'
              : 'text-brand-ink hover:-translate-y-0.5 hover:bg-[#edf0fa] hover:text-brand-blue',
          )}
        >
          {group.label}
        </button>
      ))}
    </div>
  );
}