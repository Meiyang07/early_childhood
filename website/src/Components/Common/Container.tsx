import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'footer' | 'header' | 'nav' | 'main';
}


export function Container({
  children,
  className,
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full  px-5 sm:px-6 lg:px-12',
        className,
      )}
    >
      {children}
    </Tag>
  );
}