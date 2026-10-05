import type { Step } from '@/types';

export const ENROLLMENT_STEPS: Step[] = [
  {
    icon: 'calendar',
    title: 'Schedule a Tour',
    text: 'Visit our school and observe our classrooms in action. Meet our teachers and see the Montessori method firsthand.',
  },
  {
    icon: 'file',
    title: 'Submit Application',
    text: 'Complete our enrollment application and provide required documentation including immunization records.',
  },
  {
    icon: 'users',
    title: 'Parent Interview',
    text: "Meet with our Head of School to discuss your child's needs and our program in detail.",
  },
  {
    icon: 'check',
    title: 'Enrollment',
    text: "Once accepted, complete enrollment paperwork and secure your child's spot with a deposit.",
  },
];

export const APPLICATION_NEXT_STEPS = [
  'We review your application within 2 business days.',
  'Our team schedules a short parent interview.',
  'You’ll receive a confirmation and enrollment packet.',
  'Welcome! Your child’s first day is scheduled.',
] as const;