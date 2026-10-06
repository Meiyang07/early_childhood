import { z } from 'zod';

export const kinds = [
  'admissions', 'staff', 'reviews', 'messages',
  'programs', 'gallery', 'events', 'blog',
] as const;

export type Kind = (typeof kinds)[number];
export type Section = 'overview' | Kind | 'settings';

export type AdminRecord = {
  id: string;
  kind: Kind;
  name: string;
  status: string;
  data: Record<string, string>;
  revision: number;
  createdAt: string;
  updatedAt: string;
};

export type Settings = {
  schoolName: string;
  email: string;
  phone: string;
  address: string;
  workingDays: string;
  openTime: string;
  closeTime: string;
  adminName: string;
};

export type PortalData = {
  records: AdminRecord[];
  settings: Settings;
  settingsRevision: number;
};

export type Field = {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'date' | 'number' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
  max?: number;
  min?: number;
};

export type KindConfig = {
  title: string;
  singular: string;
  nameLabel: string;
  description: string;
  statuses: string[];
  fields: Field[];
};

export type Account = {
  username: string;
  password: string;
  name: string;
};

// ---------- Config ----------
export const config: Record<Kind, KindConfig> = {
  admissions: {
    title: 'Admissions', singular: 'admission', nameLabel: 'Child’s name',
    description: 'Review applications and update admission decisions.',
    statuses: ['Pending', 'Review', 'Approved', 'Declined'],
    fields: [
      { key: 'program', label: 'Program', type: 'select', options: ['Infant + Toddler', 'Play Group', 'Pre-Nursery', 'Nursery', 'Preschool', 'Lower Kindergarten', 'Upper Kindergarten', 'Primary'], required: true },
      { key: 'date', label: 'Application date', type: 'date', required: true },
      { key: 'birthDate', label: 'Date of birth', type: 'date' },
      { key: 'guardian', label: 'Parent / guardian' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Phone' },
      { key: 'notes', label: 'Application notes', type: 'textarea' },
    ],
  },
  staff: {
    title: 'Staff & Teachers', singular: 'team member', nameLabel: 'Full name',
    description: 'Manage admins, teachers, and operators.',
    statuses: ['Active', 'Inactive'],
    fields: [
      { key: 'group', label: 'Team', type: 'select', options: ['Admins', 'Teachers', 'Operators'], required: true },
      { key: 'role', label: 'Role', required: true },
      { key: 'bio', label: 'About this member', type: 'textarea' },
    ],
  },
  reviews: {
    title: 'Reviews', singular: 'review', nameLabel: 'Parent’s name',
    description: 'Review parent feedback and approve testimonials.',
    statuses: ['Pending', 'Approved', 'Hidden'],
    fields: [
      { key: 'rating', label: 'Rating', type: 'select', options: ['5', '4', '3', '2', '1'], required: true },
      { key: 'body', label: 'Review', type: 'textarea', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true },
    ],
  },
  messages: {
    title: 'Messages', singular: 'message', nameLabel: 'Sender’s name',
    description: 'Read enquiries and keep track of follow-up.',
    statuses: ['Unread', 'Read', 'Resolved'],
    fields: [
      { key: 'subject', label: 'Subject', required: true },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'body', label: 'Message', type: 'textarea', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true },
    ],
  },
  programs: {
    title: 'Programs', singular: 'program', nameLabel: 'Program name',
    description: 'Edit program details and monthly tuition.',
    statuses: ['Published', 'Draft'],
    fields: [
      { key: 'age', label: 'Age group', required: true },
      { key: 'fee', label: 'Monthly fee (NPR)', type: 'number', min: 0, max: 100000 },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  gallery: {
    title: 'Gallery', singular: 'photo', nameLabel: 'Photo title',
    description: 'Add school photos and organize gallery categories.',
    statuses: ['Published', 'Draft'],
    fields: [
      { key: 'category', label: 'Category', type: 'select', options: ['Classroom', 'Activities', 'Outdoor', 'Graduation'], required: true },
      { key: 'alt', label: 'Image description', required: true },
    ],
  },
  events: {
    title: 'Events', singular: 'event', nameLabel: 'Event title',
    description: 'Plan upcoming school activities and events.',
    statuses: ['Published', 'Draft', 'Cancelled'],
    fields: [
      { key: 'date', label: 'Event date', type: 'date', required: true },
      { key: 'time', label: 'Time' },
      { key: 'location', label: 'Location', required: true },
      { key: 'description', label: 'Event details', type: 'textarea', required: true },
    ],
  },
  blog: {
    title: 'Blog', singular: 'blog post', nameLabel: 'Post title',
    description: 'Write and manage school news and articles.',
    statuses: ['Published', 'Draft'],
    fields: [
      { key: 'date', label: 'Post date', type: 'date', required: true },
      { key: 'author', label: 'Author', required: true },
      { key: 'excerpt', label: 'Short introduction', required: true },
      { key: 'body', label: 'Article', type: 'textarea', required: true },
    ],
  },
};

export const defaultSettings: Settings = {
  schoolName: 'Early Childhood Montessori',
  email: 'mail@earlychildhood.edu.np',
  phone: '+977 61-552290',
  address: 'Ranipauwa, Pokhara-11, Nepal',
  workingDays: 'Monday – Friday',
  openTime: '09:00',
  closeTime: '16:00',
  adminName: 'Admin',
};

// ---------- Validation ----------
export const settingsSchema = z
  .object({
    schoolName: z.string().trim().min(2).max(120),
    email: z.string().email().max(200),
    phone: z.string().trim().min(5).max(40),
    address: z.string().trim().min(3).max(300),
    workingDays: z.string().trim().min(3).max(60),
    openTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
    closeTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
    adminName: z.string().trim().min(1).max(60),
  })
  .strict()
  .refine((v) => v.openTime < v.closeTime, {
    message: 'Closing time must be after opening time.',
    path: ['closeTime'],
  });

export function validateRecord(
  kind: Kind,
  input: { name: string; status: string; data: Record<string, string> },
) {
  if (input.name.trim().length < 2) throw new Error('Enter at least 2 characters.');
  if (input.name.length > 160) throw new Error('Name is too long.');
  if (!config[kind].statuses.includes(input.status)) throw new Error('Choose a valid status.');

  const data: Record<string, string> = {};
  for (const field of config[kind].fields) {
    const value = (input.data[field.key] ?? '').trim();
    if (field.required && !value) throw new Error(`${field.label} is required.`);
    if (field.type !== 'textarea' && value.length > 300)
      throw new Error(`${field.label} is too long.`);
    if (value && field.type === 'email' && !z.string().email().safeParse(value).success)
      throw new Error('Enter a valid email address.');
    if (value && field.type === 'select' && !field.options?.includes(value))
      throw new Error(`Choose a valid ${field.label.toLowerCase()}.`);
    if (value && field.type === 'number' &&
      (!Number.isFinite(Number(value)) ||
        Number(value) < (field.min ?? 0) ||
        Number(value) > (field.max ?? 100000)))
      throw new Error(`Enter a valid ${field.label.toLowerCase()}.`);
    if (value && field.type === 'date' &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        !Number.isFinite(new Date(value).getTime()) ||
        new Date(value).toISOString().slice(0, 10) !== value))
      throw new Error('Enter a valid date.');
    data[field.key] = value;
  }

  if (kind === 'staff' || kind === 'gallery') {
    data.imagePath = input.data.imagePath ?? '';
  }
  if (input.data.example === 'true') data.example = 'true';

  return { name: input.name.trim(), status: input.status, data };
}

// ---------- Helpers ----------
export const today = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Katmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

export const timeLabel = (value: string) =>
  new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(new Date(`2000-01-01T${value}:00Z`));

export const titleCase = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function dateLabel(date: string) {
  return date
    ? new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Katmandu',
      }).format(new Date(date + 'T00:00:00Z'))
    : '—';
}