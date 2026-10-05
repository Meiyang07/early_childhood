import type { Program, SchoolProgram } from '@/types';

export const HOME_PROGRAMS: Program[] = [
  {
    id: 'infant',
    emoji: '👶',
    title: 'Infant Program',
    age: 'Ages 12-36 months',
    points: [
      'Secure attachment with primary caregivers',
      'Freedom of movement',
      'Sensory exploration',
      'Language-rich environment',
    ],
    color: 'rose',
  },
  {
    id: 'toddler',
    emoji: '🧸',
    title: 'Toddler Program',
    age: 'Ages 18-36 months',
    points: [
      'Independence and self-care skills',
      'Language development',
      'Practical life activities',
      'Social interaction',
    ],
    color: 'sky',
  },
  {
    id: 'preschool',
    emoji: '📚',
    title: 'Preschool Program',
    age: 'Ages 3-6 years',
    points: [
      'Academic foundation',
      'Cultural studies',
      'Mathematical concepts',
      'Reading and writing readiness',
    ],
    color: 'mint',
  },
];

export const SCHOOL_PROGRAMS: SchoolProgram[] = [
  {
    id: 'infant',
    age: '18 months',
    title: 'Infant + Toddler',
    description:
      'Gentle introduction to a structured environment. Sensory exploration, movement, language stimulation, and bonding through guided play.',
    icon: 'heart',
    tone: 'baby',
  },
  {
    id: 'prenursery',
    age: '2.5–3 Years',
    title: 'Pre-Nursery',
    description:
      'Building early social skills, language, and independence through creative play, storytelling, music, and Montessori sensorial activities.',
    icon: 'sun',
    tone: 'white',
  },
  {
    id: 'nursery',
    age: '3–4 Years',
    title: 'Nursery',
    description:
      'Language development, social skills, and creative activities. Structured exploration using authentic Montessori materials in a nurturing classroom.',
    icon: 'book',
    tone: 'white-dark',
  },
  {
    id: 'lower-kindergarten',
    age: '4–5 Years',
    title: 'Lower Kindergarten',
    description:
      'Early literacy, numeracy, science, and practical life activities. Developing curiosity and foundational academic skills with hands-on learning.',
    icon: 'sparkle',
    tone: 'blue',
  },
  {
    id: 'upper-kindergarten',
    age: '5–6 Years',
    title: 'Upper Kindergarten',
    description:
      'School readiness, leadership, confidence building, and academic preparation. Children develop responsibility and critical thinking for primary school.',
    icon: 'award',
    tone: 'slate',
  },
  {
    id: 'primary',
    age: '6–10 Years',
    title: 'Primary',
    description:
      'Subject-specialist teachers guide children through each grade with a focus on deep understanding, independent thinking, and academic excellence.',
    icon: 'book',
    tone: 'sand',
  },
];

export const PROGRAM_ACTIVITIES = [
  { icon: 'book' as const, label: 'Practical Life' },
  { icon: 'sparkle' as const, label: 'Sensorial Activities' },
  { icon: 'users' as const, label: 'Language Development' },
  { icon: 'award' as const, label: 'Mathematics' },
  { icon: 'leaf' as const, label: 'Cultural Studies' },
  { icon: 'heart' as const, label: 'Art & Craft' },
  { icon: 'sun' as const, label: 'Music & Dance' },
  { icon: 'sparkle' as const, label: 'Outdoor Play' },
];

export const PROGRAM_OPTIONS = [
  'Infant + Toddler',
  'Play Group',
  'Pre-Nursery',
  'Nursery',
  'Preschool',
  'Lower Kindergarten',
  'Upper Kindergarten',
  'Primary',
] as const;

export const GENDER_OPTIONS = ['Female', 'Male', 'Other', 'Prefer not to say'] as const;

export const ADMISSION_BREAKDOWN = [
  {
    dot: 'purple',
    program: 'Infant + Toddler',
    age: '18 months',
    duration: '8 months',
    teachers: '3',
    children: '12',
  },
  {
    dot: 'red',
    program: 'Pre-Nursery',
    age: '2.5–3 years',
    duration: '6 months',
    teachers: '2',
    children: '15',
  },
  {
    dot: 'orange',
    program: 'Nursery',
    age: '3–4 years',
    duration: '1 year',
    teachers: '4',
    teacherNote: '2 per section',
    children: '35',
    childrenNote: 'Divided into 2 sections',
  },
  {
    dot: 'green',
    program: 'Lower Kindergarten',
    age: '4–5 years',
    duration: '1 year',
    teachers: '4',
    teacherNote: '2 per section',
    children: '35',
    childrenNote: 'Divided into 2 sections',
  },
  {
    dot: 'purple',
    program: 'Upper Kindergarten',
    age: '5–6 years',
    duration: '1 year',
    teachers: '4',
    teacherNote: '2 per section',
    children: '35',
    childrenNote: 'Divided into 2 sections',
  },
  {
    dot: 'blue',
    program: 'Primary',
    age: '6–10 years',
    duration: '1 year per grade',
    teachers: '7',
    teacherNote: 'Subject specialists',
    children: '16',
    childrenNote: 'Maximum per class',
  },
] as const;

export const PROGRAM_CALLOUTS = [
  'Nursery, LKG & UKG are divided into two sections of up to 17–18 children each.',
  'Primary classes have a maximum of 16 students per class.',
  'Primary teachers specialize in their subject areas.',
] as const;

export const DOT_COLORS: Record<string, string> = {
  purple: 'bg-[#705080]',
  red: 'bg-[#f22424]',
  orange: 'bg-[#e96729]',
  green: 'bg-[#19b680]',
  blue: 'bg-brand-blue',
};