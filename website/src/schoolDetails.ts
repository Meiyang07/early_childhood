export const schoolDetails = {
  email: 'mail@earlychildhood.edu.np',
  phone: '+977 61-552290',
  phoneLink: 'tel:+97761552290',
  workingDays: 'Monday – Friday',
  workingHours: '9:00 AM – 4:00 PM',
  compactHours: 'Mon–Fri 9:00am – 4:00pm',
} as const;

// Monthly fees supplied in the enrollment page reference.
export const tuitionFees = [
  { program: 'Play Group', monthly: 'Rs 2,900' },
  { program: 'Nursery', monthly: 'Rs 3,200' },
  { program: 'Preschool', monthly: 'Rs 3,400' },
] as const;
