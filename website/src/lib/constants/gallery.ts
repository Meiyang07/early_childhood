export const GALLERY_CATEGORIES = [
  'All',
  'Activities',
  'Classroom',
  'Outdoor',
  'Cultural',
  'Events',
  'Graduation',
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const FEATURED_GALLERY_IMAGES = [
  'gallery/graduation-2081-01.webp',
  'gallery/outdoor-02.jpg',
  'gallery/classroom-01.jpg',
  'gallery/cultural-01.jpg',
  'gallery/events-10.webp',
  'gallery/cultural-02.jpg',
  'gallery/outdoor-05.jpg',
  'gallery/cultural-03.jpg',
  'gallery/events-11.webp',
  'gallery/activities-13.jpg',
  'gallery/activities-23.jpg',
  'gallery/activities-27.webp',
] as const;