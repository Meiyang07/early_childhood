import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  as?: 'h1' | 'h2';
  className?: string;
  showLine?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  as: Tag = 'h2',
  className,
  showLine = false,
}: SectionHeadingProps) {
  return (
    <div className={cn('text-center', className)}>
      <Tag
        className={cn(
          'font-serif font-bold leading-tight',
          Tag === 'h1'
            ? 'text-[clamp(2.125rem,3.8vw,3.3rem)]'
            : 'text-[clamp(1.7rem,2.2vw,2.125rem)] font-medium',
        )}
      >
        {title}
      </Tag>
      {subtitle && (
        <p className="mt-1 text-base leading-snug text-brand-ink/80 md:text-lg">{subtitle}</p>
      )}
      {showLine && <span className="mx-auto mt-4 block h-1 w-[70px] rounded-full bg-brand-blue" />}
    </div>
  );
}