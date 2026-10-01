import { useEffect } from 'react';

const revealSelector = [
  'main .section-heading', 'main .welcome-section h2', 'main .quote-section h2',
  'main .quote-row > *', 'main .welcome-copy', 'main .welcome-photo',
  'main .about-intro > *', 'main .team-intro-copy', 'main .team-illustration',
  'main .team-heading', 'main .team-tabs', 'main article:not(.article-dialog)',
  'main .gallery-filters', 'main .gallery-item', 'main .activity-tile',
  'main .contact-heading', 'main .contact-details > *', 'main .contact-form-panel',
  'main .application-form fieldset', 'main .application-sidebar > *',
  'main .application-consent', 'main .tuition-table-wrap', 'main .additional-info',
  'main .breakdown-title', 'main .breakdown-table-wrap', 'main .program-callouts > *',
  'main .requirements-section h2', 'main .faq-section h2', 'main .activities-section h2',
  'main .testimonial-grid > blockquote', 'main .journey h2', 'main .journey p',
  'main .journey-actions', '.partners h2', '.partner-line > a', '.footer-grid > div',
].join(',');

const tiltSelector = '.feature-card, .program-card, .school-program-card, .value-card, .blog-card, .staff-card, .gallery-item, .welcome-photo';
const sceneSelector = '.site-header, .home-hero, .page-banner, .journey, .partners, .team-illustration';

function startMotion() {
  if (!('IntersectionObserver' in window)) return () => {};
  const root = document.documentElement;
  const tracked = new Set<HTMLElement>();
  const scenes = new Set<HTMLElement>();
  const tilted = new Set<HTMLElement>();
  const ripples = new Set<HTMLElement>();
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 821px)');
  let stagger = 0;
  let pointerFrame = 0;
  let activeCard: HTMLElement | null = null;
  let point = { x: 0, y: 0 };

  const reveals = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        reveals.unobserve(entry.target);
      }
    });
  }, { threshold: 0.04, rootMargin: '0px 0px -16px 0px' });
  const ambient = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('ambient-active', entry.isIntersecting));
  }, { threshold: 0 });

  function register(scope: ParentNode) {
    const candidates = Array.from(scope.querySelectorAll<HTMLElement>(revealSelector));
    if (scope instanceof HTMLElement && scope.matches(revealSelector)) candidates.unshift(scope);
    candidates.forEach(element => {
      if (tracked.has(element)) return;
      tracked.add(element);
      element.style.setProperty('--reveal-delay', `${(stagger++ % 4) * 65}ms`);
      element.dataset.revealDirection = element.matches('.welcome-copy, .team-intro-copy, .about-intro > div') ? 'left' : 'up';
      element.classList.add('reveal');
      reveals.observe(element);
    });
    const backgrounds = Array.from(scope.querySelectorAll<HTMLElement>(sceneSelector));
    if (scope instanceof HTMLElement && scope.matches(sceneSelector)) backgrounds.unshift(scope);
    backgrounds.forEach(element => {
      if (scenes.has(element)) return;
      scenes.add(element);
      ambient.observe(element);
    });
  }

  root.classList.add('motion-ready');
  register(document);
  const mutations = new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node instanceof HTMLElement) register(node);
    }));
    tracked.forEach(element => {
      if (!element.isConnected) { reveals.unobserve(element); tracked.delete(element); }
    });
    scenes.forEach(element => {
      if (!element.isConnected) { ambient.unobserve(element); scenes.delete(element); }
    });
  });
  mutations.observe(document.body, { childList: true, subtree: true });

  function resetCard() {
    if (!activeCard) return;
    activeCard.style.removeProperty('--tilt-x');
    activeCard.style.removeProperty('--tilt-y');
    activeCard.style.removeProperty('--spot-x');
    activeCard.style.removeProperty('--spot-y');
    activeCard = null;
  }

  function pointerMove(event: PointerEvent) {
    if (!finePointer.matches || event.pointerType === 'touch' || !(event.target instanceof Element)) return;
    const card = event.target.closest<HTMLElement>(tiltSelector);
    if (card !== activeCard) { resetCard(); activeCard = card; }
    if (!card) return;
    point = { x: event.clientX, y: event.clientY };
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      pointerFrame = 0;
      if (!activeCard) return;
      const bounds = activeCard.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = Math.max(0, Math.min(1, (point.x - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (point.y - bounds.top) / bounds.height));
      activeCard.classList.add('has-tilt');
      tilted.add(activeCard);
      activeCard.style.setProperty('--tilt-x', `${(0.5 - y) * 4.5}deg`);
      activeCard.style.setProperty('--tilt-y', `${(x - 0.5) * 4.5}deg`);
      activeCard.style.setProperty('--spot-x', `${x * 100}%`);
      activeCard.style.setProperty('--spot-y', `${y * 100}%`);
    });
  }

  function ripple(event: PointerEvent) {
    if (!(event.target instanceof Element)) return;
    const control = event.target.closest<HTMLElement>('a.button, .map-button, button:not(.gallery-item):not(.menu-toggle):not(.modal-close):not(:disabled)');
    if (!control) return;
    const bounds = control.getBoundingClientRect();
    const bubble = document.createElement('span');
    bubble.className = 'motion-ripple';
    bubble.setAttribute('aria-hidden', 'true');
    bubble.style.setProperty('--ripple-x', `${event.clientX - bounds.left}px`);
    bubble.style.setProperty('--ripple-y', `${event.clientY - bounds.top}px`);
    bubble.style.setProperty('--ripple-size', `${Math.max(bounds.width, bounds.height) * 2}px`);
    ripples.add(bubble);
    bubble.addEventListener('animationend', () => { bubble.remove(); ripples.delete(bubble); }, { once: true });
    control.appendChild(bubble);
  }

  function focusReveal(event: FocusEvent) {
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest<HTMLElement>('.reveal');
    if (target) { target.classList.add('in-view'); reveals.unobserve(target); }
  }

  document.addEventListener('pointermove', pointerMove, { passive: true });
  document.addEventListener('pointerdown', ripple, { passive: true });
  document.addEventListener('pointerleave', resetCard);
  document.addEventListener('focusin', focusReveal);
  window.addEventListener('blur', resetCard);
  window.addEventListener('scroll', resetCard, { passive: true });

  return () => {
    reveals.disconnect(); ambient.disconnect(); mutations.disconnect();
    window.cancelAnimationFrame(pointerFrame);
    resetCard();
    document.removeEventListener('pointermove', pointerMove);
    document.removeEventListener('pointerdown', ripple);
    document.removeEventListener('pointerleave', resetCard);
    document.removeEventListener('focusin', focusReveal);
    window.removeEventListener('blur', resetCard);
    window.removeEventListener('scroll', resetCard);
    tracked.forEach(element => {
      element.classList.remove('reveal', 'in-view');
      element.style.removeProperty('--reveal-delay');
      delete element.dataset.revealDirection;
    });
    scenes.forEach(element => element.classList.remove('ambient-active'));
    tilted.forEach(element => {
      element.classList.remove('has-tilt');
      ['--tilt-x', '--tilt-y', '--spot-x', '--spot-y'].forEach(property => element.style.removeProperty(property));
    });
    ripples.forEach(element => element.remove());
    root.classList.remove('motion-ready');
  };
}

export function useSiteMotion(pathname: string) {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stopMotion = () => {};
    let progressFrame = 0;
    function progress() {
      if (progressFrame) return;
      progressFrame = window.requestAnimationFrame(() => {
        progressFrame = 0;
        const length = root.scrollHeight - window.innerHeight;
        root.style.setProperty('--page-progress', String(length > 0 ? Math.max(0, Math.min(1, window.scrollY / length)) : 0));
      });
    }
    function preferenceChanged() {
      stopMotion();
      stopMotion = reducedMotion.matches ? () => {} : startMotion();
    }
    function visibilityChanged() { root.classList.toggle('motion-paused', document.hidden); }
    preferenceChanged();
    visibilityChanged();
    progress();
    const resize = 'ResizeObserver' in window ? new ResizeObserver(progress) : null;
    resize?.observe(document.body);
    window.addEventListener('scroll', progress, { passive: true });
    window.addEventListener('resize', progress);
    reducedMotion.addEventListener('change', preferenceChanged);
    document.addEventListener('visibilitychange', visibilityChanged);
    return () => {
      stopMotion(); resize?.disconnect();
      window.cancelAnimationFrame(progressFrame);
      window.removeEventListener('scroll', progress);
      window.removeEventListener('resize', progress);
      reducedMotion.removeEventListener('change', preferenceChanged);
      document.removeEventListener('visibilitychange', visibilityChanged);
      root.classList.remove('motion-paused');
      root.style.removeProperty('--page-progress');
    };
  }, [pathname]);
}
