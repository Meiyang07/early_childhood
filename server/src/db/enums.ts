// src/db/enums.ts

export const ADMISSION_STATUSES = ['Pending', 'Review', 'Approved', 'Declined'] as const;
export type AdmissionStatus = (typeof ADMISSION_STATUSES)[number];

export const USER_ROLES = ['admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const TIME_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
export const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const CLOUDINARY_URL_REGEX = /^https:\/\/res\.cloudinary\.com\/.+/;

export const ADMISSION_PROGRAMS = [
  'Infant + Toddler',
  'Play Group',
  'Pre-Nursery',
  'Nursery',
  'Preschool',
  'Lower Kindergarten',
  'Upper Kindergarten',
  'Primary',
] as const;


export type AdmissionProgram = (typeof ADMISSION_PROGRAMS)[number];

export const STAFF_STATUSES = ['Active', 'Inactive'] as const;
export type StaffStatus = (typeof STAFF_STATUSES)[number];

export const REVIEW_STATUSES = ['Pending', 'Approved', 'Hidden'] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const PUBLISH_STATUSES = ['Published', 'Draft'] as const;
export type PublishStatus = (typeof PUBLISH_STATUSES)[number];

export const EVENT_STATUSES = ['Published', 'Draft', 'Cancelled'] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const GALLERY_CATEGORIES = ['Classroom', 'Activities', 'Outdoor', 'Graduation'] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

