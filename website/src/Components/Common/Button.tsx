import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type ButtonVariant = 'blue' | 'cream' | 'white' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  rounded?: 'full' | 'small' | 'md';
}

interface LinkButtonProps extends BaseProps {
  to: string;
  onClick?: () => void;
  'aria-label'?: string;
}

interface ActionButtonProps extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  type?: 'button' | 'submit' | 'reset';
}

const VARIANTS: Record<ButtonVariant, string> = {
  blue: 'bg-brand-blue text-white hover:bg-brand-blue-dark',
  cream: 'bg-[#f3ede8] text-[#151515] hover:bg-[#eae2dc]',
  white: 'bg-white text-brand-blue hover:bg-white/95',
  outline: 'bg-transparent text-white border-2 border-[#12328a] hover:bg-white/10',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-7 py-3.5 text-base',
  lg: 'px-8 py-4 text-lg',
};

const ROUNDED = {
  full: 'rounded-full',
  small: 'rounded-[7px]',
  md: 'rounded-[10px]',
};

const BASE =
  'relative isolate inline-flex items-center justify-center gap-2 overflow-hidden text-center font-medium transition-all duration-200 ' +
  'hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(16,28,52,0.16)] active:scale-[0.98] ' +
  'after:pointer-events-none after:absolute after:-inset-y-[40%] after:-left-[70%] after:w-[45%] after:rotate-[20deg] ' +
  'after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] after:transition-transform after:duration-[600ms] ' +
  'hover:after:translate-x-[430%]';

function classes(variant: ButtonVariant, size: ButtonSize, rounded: keyof typeof ROUNDED, extra?: string) {
  return cn(BASE, VARIANTS[variant], SIZES[size], ROUNDED[rounded], extra);
}

export function ButtonLink({ to, variant = 'blue', size = 'md', rounded = 'full', className, children, ...rest }: LinkButtonProps) {
  return (
    <Link to={to} className={classes(variant, size, rounded, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({ variant = 'blue', size = 'md', rounded = 'full', className, children, type = 'button', ...rest }: ActionButtonProps) {
  return (
    <button type={type} className={classes(variant, size, rounded, className)} {...rest}>
      {children}
    </button>
  );
}