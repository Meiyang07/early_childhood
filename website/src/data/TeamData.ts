import type { TeamGroup, TeamMember } from '@/types';

export const TEAM_GROUPS: ReadonlyArray<{ id: TeamGroup; label: string }> = [
  { id: 'admins', label: 'Admins' },
  { id: 'teachers', label: 'Teachers' },
  { id: 'operators', label: 'Operators' },
];

export const TEAM_MEMBERS: Record<TeamGroup, TeamMember[]> = {
  admins: [
    { name: 'Dipendra Marsani', role: 'Director', image: 'admins/dipendra-marsani.jpg' },
    { name: 'Shalvi Marsani', role: 'Principal', image: 'admins/Shalvi-Marsani.jpg' },
    { name: 'Bipana Gurung', role: 'Admin', image: 'admins/bipana-gurung.jpg' },
    { name: 'Zaharuddin Raeen', role: 'Admin', image: 'admins/zaharudin-raeen.jpg' },
    { name: 'Maniraj Tamang', role: 'Admin', image: 'admins/maniraj-tamang.jpg' },
  ],
  teachers: [
    { name: 'Alina Gurung', role: 'Teacher', image: 'teachers/alina-gurung.jpg' },
    { name: 'Sanju Khati', role: 'Teacher', image: 'teachers/sanju-khati.jpg' },
    { name: 'Ambika Shrestha', role: 'Teacher', image: 'teachers/ambika-shrestha.jpg' },
    { name: 'Anjila Gaire', role: 'Teacher', image: 'teachers/anjila-gaire.jpg' },
    { name: 'Asmita Nepali', role: 'Teacher', image: 'teachers/ashmita-nepal.jpg' },
    { name: 'Asmita Rasaili', role: 'Teacher', image: 'teachers/asmita-rasaili.jpg' },
    { name: 'Rupa Shrestha', role: 'Teacher', image: 'teachers/rupa-shrestha.jpg' },
    { name: 'Manisha Pandey', role: 'Teacher', image: 'teachers/manisha-pandey.jpg' },
    { name: 'Astha Kunwar', role: 'Teacher', image: 'teachers/astha-kunwar.jpg' },
    { name: 'Sijan Gharti', role: 'Teacher', image: 'teachers/sijan-gharti.jpg' },
    { name: 'Anjila Gurung', role: 'Teacher', image: 'teachers/anjila-gurung.jpg' },
    { name: 'Pritika Sunar', role: 'Teacher', image: 'teachers/pritika-sunar.jpg' },
    { name: 'Asmita Gurung', role: 'Teacher', image: 'teachers/asmita-gurung.jpg' },
  ],
  operators: [
    { name: 'Dipak B.K', role: 'Driver', image: 'operators/dipak-bk.jpg' },
    { name: 'Devi Thapaliya', role: 'Canteen Staff', image: 'operators/devi-thapali.jpg' },
    { name: 'Niru Shrestha', role: 'Canteen Staff', image: 'operators/niru-shrestha.jpg' },
    { name: 'Shankar Tamang', role: 'Operator' },
    { name: 'Bimal Gurung', role: 'Operator' },
    { name: 'Sarswati Bhatrai', role: 'Operator' },
    { name: 'Rekha Subedi', role: 'Operator' },
    { name: 'Laxmi Baral', role: 'Operator' },
  ],
};