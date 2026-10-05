export const SITE_NAME = {
  title: 'Early Childhood',
  subtitle: 'Montessori',
  fullName: 'Early Childhood Montessori & Academy',
  copyright: '© 2026 Montessori Early Childhood. All rights reserved.',
} as const;

export const ASSET_BASE_PATH = '/assets';

export const SCHOOL_MAP_URL =
  'https://www.google.com/maps/place/Early+Childhood+Montessori+school/@28.2223921,83.9922149,17z/data=!3m1!4b1!4m6!3m5!1s0x399595e69dbf461d:0x159667f2826bee09!8m2!3d28.2223921!4d83.9922149!16s%2Fg%2F11kblcdpw4?hl=en-GB&entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D';

export const SCHOOL_MAP_EMBED_URL =
  'https://www.google.com/maps?q=28.2223921%2C83.9922149&z=17&output=embed';

export const WELCOME_PHOTOS = [
  {
    image: 'gallery/classroom-03.jpg',
    alt: 'A child exploring pink Montessori blocks',
    position: 'center 35%',
  },
  {
    image: 'gallery/classroom-02.jpg',
    alt: 'Children learning together with their teacher',
    position: 'center 35%',
  },
  {
    image: 'gallery/classroom-01.jpg',
    alt: 'Books and learning resources in our classroom',
    position: 'center',
  },
  {
    image: 'gallery/activities-32.webp',
    alt: 'Children drawing and coloring in their classroom',
    position: 'center 18%',
  },
] as const;

export const PARTNER_LOGOS = [
  {
    href: 'https://pocomat.com/pocomatdevineers-home',
    src: 'pocomat-devineers-logo.jpg',
    alt: 'Pocomat Devineers logo',
    ariaLabel: 'Visit Pocomat Devineers',
  },
  {
    href: 'https://pocomat.com/computeracademy-home',
    src: 'pocomat-computer-logo.jpg',
    alt: 'Pocomat Computer Academy logo',
    ariaLabel: 'Visit Pocomat Computer Academy',
  },
] as const;