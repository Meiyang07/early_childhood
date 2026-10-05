import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { SiteLinkProps } from '@/types';
import { scrollToHash } from '@/lib/utils';

export function SiteLink({ to, children, className = '', onClick, ...rest }: SiteLinkProps) {
  const navigate = useNavigate();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.();
    if (
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey &&
      to.startsWith('/')
    ) {
      event.preventDefault();
      const hash = to.split('#')[1];
      navigate(to.split('#')[0]);
      if (hash) scrollToHash(hash);
      else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }

  return (
    <Link to={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}