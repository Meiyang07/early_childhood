import type { IconName } from '@/types';
import { JSX } from 'react/jsx-dev-runtime';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

const PATHS: Record<IconName, JSX.Element> = {
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19 19 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L7.5 10a15 15 0 0 0 6.5 6.5l1.5-1.5a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2Z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  heart: (
    <path d="M20.8 8.2c0 5-8.8 10.8-8.8 10.8S3.2 13.2 3.2 8.2a4.4 4.4 0 0 1 8.8-.8 4.4 4.4 0 0 1 8.8.8Z" />
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5.4a3 3 0 0 1 0 5.2M18 14a5 5 0 0 1 3 4.6V20" />
    </>
  ),
  sparkle: (
    <>
      <path d="m12 2 1.9 7.1L21 11l-7.1 1.9L12 20l-1.9-7.1L3 11l7.1-1.9L12 2ZM20 19l.5 1.5L22 21l-1.5.5L20 23l-.5-1.5L18 21l1.5-.5L20 19Z" />
    </>
  ),
  book: (
    <path d="M12 5a9 9 0 0 0-9-2v15a9 9 0 0 1 9 2 9 9 0 0 1 9-2V3a9 9 0 0 0-9 2v15" />
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="5" />
      <path d="m8 12-1 9 5-3 5 3-1-9" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 1.5M9 2h6M12 2v3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 2v6M17 2v6M3 10h18" />
    </>
  ),
  file: <path d="M5 2h9l5 5v15H5zM14 2v5h5M8 12h8M8 16h8" />,
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  leaf: <path d="M20 3C10 3 4 8 4 15a6 6 0 0 0 6 6c7 0 12-6 10-18ZM4 21c2-5 6-9 12-12" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M5 5 19 19M19 5 5 19" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
};

export function Icon({ name, size = 20, className = '' }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}