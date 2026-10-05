import type { EventItem } from '@/types';

export const EVENTS: EventItem[] = [
  {
    day: '15',
    month: 'Jan 2025',
    title: 'Open Admissions Day',
    category: 'Admissions',
    description:
      'Visit our campus, meet our teachers, and learn about all our programs. Registration encouraged.',
    time: '10:00 AM – 12:00 PM',
    color: 'cyan',
  },
  {
    day: '14',
    month: 'Feb 2025',
    title: "Valentine's Craft Day",
    category: 'Activities',
    description: 'Children create heartfelt cards and crafts celebrating love, kindness, and friendship.',
    time: '9:00 AM – 12:00 PM',
    color: 'slate',
  },
  {
    day: '15',
    month: 'Feb 2025',
    title: 'Annual Sports Day',
    category: 'Sports',
    description:
      'Fun-filled athletic events, races, and games celebrating our young champions and spirited learners.',
    time: '9:00 AM – 2:00 PM',
    color: 'steel',
  },
  {
    day: '05',
    month: 'Mar 2025',
    title: 'Spring Arts Festival',
    category: 'Cultural',
    description:
      'Art exhibitions, cultural performances, and Montessori showcases for the whole family to enjoy.',
    time: '10:00 AM – 4:00 PM',
    color: 'charcoal',
  },
  {
    day: '20',
    month: 'Mar 2025',
    title: 'Parent-Teacher Meeting',
    category: 'Meeting',
    description:
      "Individual progress discussions with your child's teacher. Appointment booking is required.",
    time: '8:30 AM – 5:00 PM',
    color: 'electric',
  },
  {
    day: '22',
    month: 'Apr 2025',
    title: 'Earth Day Celebration',
    category: 'Outdoor',
    description:
      'Nature walks, tree-planting, and eco-art activities celebrating our beautiful Himalayan environment.',
    time: '9:00 AM – 1:00 PM',
    color: 'royal',
  },
];

export const EVENT_TAG_COLORS: Record<string, string> = {
  admissions: 'text-sky-600 bg-sky-50',
  activities: 'text-red-400 bg-red-50',
  sports: 'text-lime-600 bg-lime-50',
  cultural: 'text-amber-500 bg-amber-50',
  meeting: 'text-purple-600 bg-purple-50',
  outdoor: 'text-teal-600 bg-teal-50',
};

export const EVENT_DATE_COLORS: Record<string, string> = {
  cyan: 'bg-[#69c2f7]',
  slate: 'bg-[#94a5bf]',
  steel: 'bg-[#55627f]',
  charcoal: 'bg-[#2f3e56]',
  electric: 'bg-[#1d60eb]',
  royal: 'bg-brand-blue',
};