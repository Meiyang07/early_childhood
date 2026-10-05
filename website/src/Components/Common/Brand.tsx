import { ROUTES } from '@/routes/path';
import { SiteLink } from './SiteLink';

import { asset, cn } from '@/lib/utils';
import { SITE_NAME } from '@/lib/constants';


interface BrandProps {
  light?: boolean;
  className?: string;
}

export function Brand({ light = false, className }: BrandProps) {
  return (
    <SiteLink
      to={ROUTES.HOME}
      aria-label={`${SITE_NAME.fullName} home`}
      className={cn(
        'inline-flex min-w-max items-center gap-2',
        light ? 'text-white' : 'text-brand-ink',
        className,
      )}
    >
      <img
        src={asset('school-logo.jpg')}
        alt=""
        className={cn(
          'h-[52px] w-[48px] object-contain transition-transform duration-300 hover:-rotate-3 hover:scale-105 lg:h-[61px] lg:w-[59px]',
          light && 'rounded-sm bg-white',
        )}
      />
      <span className="flex flex-col leading-none">
        <strong
          className={cn(
            'whitespace-nowrap font-serif text-[19px] font-extrabold lg:text-[25px]',
            !light && 'font-extrabold',
          )}
        >
          {SITE_NAME.title}
        </strong>
        <small className="mt-1 font-lora text-xs font-bold [text-shadow:0.3px_0_currentColor,-0.3px_0_currentColor] lg:text-sm">
          {SITE_NAME.subtitle}
        </small>
      </span>
    </SiteLink>
  );
}