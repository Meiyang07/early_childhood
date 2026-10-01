import { useState, type KeyboardEvent } from 'react';
import { teamGroups, teamMembers, type TeamGroup, type TeamMember } from './teamData';

function initialGroup(): TeamGroup {
  const group = new URLSearchParams(window.location.search).get('group');
  return teamGroups.some(item => item.id === group) ? group as TeamGroup : 'admins';
}

function StaffCard({ member }: { member: TeamMember }) {
  const [photoUnavailable, setPhotoUnavailable] = useState(false);
  const initials = member.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('');
  return <article className="staff-card">
    {member.image && !photoUnavailable
      ? <img className="staff-photo" src={`/assets/team/${member.image}`} alt={member.name} width={250} height={250} loading="lazy" onError={() => setPhotoUnavailable(true)} />
      : <div className="staff-photo staff-initials" role="img" aria-label={`Photo unavailable for ${member.name}`}><span aria-hidden="true">{initials}</span></div>}
    <h3>{member.name}</h3>
    <p>{member.role}</p>
  </article>;
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

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % teamGroups.length;
    else if (event.key === 'ArrowLeft') next = (index + teamGroups.length - 1) % teamGroups.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = teamGroups.length - 1;
    else return;
    event.preventDefault();
    selectGroup(teamGroups[next].id, true);
  }

  return <>
    <section className="page-banner banner-pink team-banner"><div className="container">
      <h1>Our Team</h1>
      <p>The dedicated educators and staff who bring the Montessori philosophy<br className="desktop-only" /> to life for every child, every day.</p>
    </div></section>
    <section className="team-intro"><div className="container team-intro-grid">
      <div className="team-intro-copy">
        <h2>Our staff are guided by the<br /><span>Principles</span> of –</h2>
        <p>It is a common fact that the future of the student lies in the hands of their teacher.<br />
          We have a team of competent and dedicated teachers, holding a diploma in the Montessori method and well qualified in their respective study areas.<br />
          Our staff attend to each child’s individual needs and fulfill their responsibility properly.<br />
          We work together to make our school a place where we enjoy our work.</p>
      </div>
      <div className="team-illustration"><svg className="team-graduation-cap" viewBox="0 0 360 280" fill="currentColor" aria-hidden="true">
        <path d="M8 86 184 11l169 75-169 76L8 86Z" />
        <path d="m92 143 92 42 104-47v86l-104 47-92-45v-83Z" />
        <path d="M37 102h12v91c10 14 15 34 17 50-8 9-19 13-28 11-7 0-13-3-18-7 1-20 7-42 17-55v-90Z" />
      </svg></div>
    </div></section>
    <section className="team-members-section"><div className="container">
      <div className="team-heading"><h2>Get to know our team</h2><p>Dedicated Team Members</p></div>
      <div className="team-tabs" role="tablist" aria-label="Team groups">
        {teamGroups.map((group, index) => <button type="button" key={group.id}
          id={`team-tab-${group.id}`} role="tab" aria-selected={activeGroup === group.id}
          aria-controls={`team-panel-${group.id}`} tabIndex={activeGroup === group.id ? 0 : -1}
          onClick={() => selectGroup(group.id)} onKeyDown={event => navigateTabs(event, index)}>{group.label}</button>)}
      </div>
      {teamGroups.map(group => <div key={group.id} className="team-panel" role="tabpanel"
        id={`team-panel-${group.id}`} aria-labelledby={`team-tab-${group.id}`} hidden={activeGroup !== group.id} tabIndex={0}>
        <div className="team-grid">{teamMembers[group.id].map(member => <StaffCard key={member.name} member={member} />)}</div>
      </div>)}
    </div></section>
  </>;
}
