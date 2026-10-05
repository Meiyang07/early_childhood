export const SCHOOL_DETAILS = {
  email: 'mail@earlychildhood.edu.np',
  secondaryEmail: 'ececmontessori@gmail.com',
  phone: '+977 61-552290',
  phoneLink: 'tel:+97761552290',
  address: {
    line1: '11 Tulsi Marg (Tulsimarga), Ranipauwa',
    line2: 'Pokhara-11, Gandaki Province 33700, Nepal',
    plusCode: '6XCW+HXG Pokhara',
    short: 'Ranipauwa, Pokhara-11, Nepal',
  },
  workingDays: 'Monday – Friday',
  workingHours: '9:00 AM – 4:00 PM',
  compactHours: 'Mon–Fri 9:00am – 4:00pm',
  weekendClosed: 'Saturday & Sunday: Closed',
} as const;

export const TUITION_FEES = [
  { program: 'Play Group', monthly: 'Rs 2,900' },
  { program: 'Nursery', monthly: 'Rs 3,200' },
  { program: 'Preschool', monthly: 'Rs 3,400' },
] as const;