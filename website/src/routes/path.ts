export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PROGRAMS: '/programs',
  ADMISSIONS: '/admissions',
  ENROLL: '/enroll',
  TEAM: '/team',
  GALLERY: '/gallery',
  EVENTS: '/events',
  BLOG: '/blog',
  CONTACT: '/contact',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];