import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { SCHOOL_DETAILS } from '@/data/schoolDetails';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Brand, Container, Icon, SiteLink } from '../Common';

export function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);

  /* ── Close drawer on route change ── */
  useEffect(() => setOpen(false), [pathname]);

  /* ── Detect page scroll for sticky shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Lock body scroll + ESC to close when drawer opens ── */
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);

    // focus first nav link for accessibility
    requestAnimationFrame(() => {
      drawerRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /* ── Resize: close drawer when returning to desktop ── */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isActive = (path: string) =>
    pathname === path || (path === '/admissions' && pathname === '/enroll');

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-300',
        scrolled && 'shadow-[0_2px_12px_rgba(20,30,60,0.08)]',
      )}
    >
      {/* ── Top bar ── */}
      <div className="hidden bg-[#223f89] text-white md:block">
        <Container className="flex min-h-[44px] items-center justify-between gap-4 py-1.5 text-[12px] lg:text-[13px]">
          <div className="flex min-w-0 items-center gap-5">
            <span className="inline-flex items-center gap-1.5 truncate">
              <Icon name="pin" size={14} />
              <span className="truncate">{SCHOOL_DETAILS.address.short}</span>
            </span>
            <a
              href={`mailto:${SCHOOL_DETAILS.email}`}
              className="hidden truncate transition hover:underline lg:inline"
            >
              {SCHOOL_DETAILS.email}
            </a>
          </div>
          <div className="flex flex-none items-center gap-5">
            <a
              href={SCHOOL_DETAILS.phoneLink}
              className="inline-flex items-center gap-1.5 whitespace-nowrap transition hover:underline"
            >
              <Icon name="phone" size={15} />
              {SCHOOL_DETAILS.phone}
            </a>
            <span className="hidden items-center gap-1.5 whitespace-nowrap lg:inline-flex">
              <Icon name="clock" size={15} />
              {SCHOOL_DETAILS.compactHours}
            </span>
          </div>
        </Container>
      </div>

      {/* ── Nav row ── */}
      <div className="border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <Container className="flex min-h-[64px] items-center justify-between gap-4 md:min-h-[72px]">
          <Brand />

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-1 lg:flex lg:gap-2 xl:gap-4"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <SiteLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'group relative whitespace-nowrap rounded-md px-3 py-2 text-[15px] font-medium transition-colors xl:text-[16px]',
                    active
                      ? 'text-brand-blue'
                      : 'text-brand-ink/80 hover:text-brand-orange',
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-brand-orange transition-transform duration-300 group-hover:scale-x-100',
                      active && 'scale-x-100',
                    )}
                  />
                </SiteLink>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-brand-blue transition hover:bg-blue-50 active:scale-95 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <Icon name={open ? 'close' : 'menu'} size={26} />
          </button>
        </Container>
      </div>

      {/* ── Mobile backdrop ── */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      {/* ── Mobile drawer ── */}
      <aside
        id="mobile-nav"
        ref={drawerRef}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-hidden={!open}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <Brand />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-blue transition hover:bg-blue-50 active:scale-95"
            aria-label="Close menu"
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        {/* Quick contact */}
        <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-4 text-xs text-gray-600">
          <a
            href={SCHOOL_DETAILS.phoneLink}
            className="flex items-center gap-2 rounded-md px-2 py-2 transition hover:bg-white hover:text-brand-blue"
          >
            <Icon name="phone" size={14} />
            {SCHOOL_DETAILS.phone}
          </a>
          <a
            href={`mailto:${SCHOOL_DETAILS.email}`}
            className="flex items-center gap-2 truncate rounded-md px-2 py-2 transition hover:bg-white hover:text-brand-blue"
          >
            <Icon name="mail" size={14} />
            <span className="truncate">{SCHOOL_DETAILS.email}</span>
          </a>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <SiteLink
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition',
                      active
                        ? 'bg-blue-50 text-brand-blue'
                        : 'text-brand-ink/85 hover:bg-gray-50 hover:text-brand-orange',
                    )}
                  >
                    <span>{item.label}</span>
                    <Icon name="arrow" size={16} className="opacity-40" />
                  </SiteLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Drawer CTA */}
        <div className="border-t border-gray-100 p-4">
          <SiteLink
            to="/contact?reason=School%20visit#message"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-blue-dark hover:shadow-lg"
          >
            Schedule a Visit
          </SiteLink>
        </div>
      </aside>
    </header>
  );
}