import type { ReactNode } from 'react';

export type IconName =
  | 'pin' | 'phone' | 'clock' | 'mail' | 'heart' | 'users' | 'sparkle' | 'book'
  | 'award' | 'timer' | 'calendar' | 'file' | 'check' | 'leaf' | 'arrow'
  | 'send' | 'menu' | 'close' | 'sun';

export interface NavItem { label: string; path: string }

export interface Feature { icon: IconName; title: string; detail: string }

export interface Program {
  id: string; emoji: string; title: string; age: string; points: string[];
  color: 'rose' | 'sky' | 'mint';
}

export interface SchoolProgram {
  id: string; age: string; title: string; description: string;
  icon: IconName; tone: string;
}

export interface GalleryItem {
  image: string; categories: string[]; alt: string; portrait: boolean;
}

export interface TeamMember { name: string; role: string; image?: string }
export type TeamGroup = 'admins' | 'teachers' | 'operators';

export interface EventItem {
  day: string; month: string; title: string; category: string;
  description: string; time: string; color: string;
}

export interface BlogPost {
  image: string; tag: string; date: string; title: string;
  excerpt: string; color: string;
}

export interface Testimonial { quote: string; author: string; role: string }
export interface Step { icon: IconName; title: string; text: string }
export interface TuitionFee { program: string; monthly: string }

export interface SiteLinkProps {
  to: string; children: ReactNode; className?: string;
  onClick?: () => void; 'aria-label'?: string;
}

export type ApplicationField =
  | 'childName' | 'birthDate' | 'gender' | 'program' | 'guardianName'
  | 'phone' | 'email' | 'address' | 'previousSchool'
  | 'medicalConditions' | 'referral';

export type ApplicationErrors = Partial<Record<ApplicationField, string>>;