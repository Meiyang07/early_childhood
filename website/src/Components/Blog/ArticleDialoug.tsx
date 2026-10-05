import { useEffect } from 'react';
import { asset } from '@/lib/utils';
import type { BlogPost } from '@/types';
import { Icon, Image, SiteLink } from '../Common';

interface ArticleDialogProps {
  post: BlogPost;
  onClose: () => void;
}

export function ArticleDialog({ post, onClose }: ArticleDialogProps) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal */}
      <article
        role="dialog"
        aria-modal="true"
        aria-label={post.title}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full flex-col overflow-hidden bg-white shadow-2xl sm:max-w-3xl sm:rounded-2xl"
        style={{ height: '100dvh', maxHeight: '100dvh' }}
      >
        {/* Hero image — fixed height, doesn't grow */}
        <div className="relative h-48 w-full shrink-0 bg-gray-100 sm:h-56 md:h-64">
          <Image
            src={asset(post.image)}
            alt={post.title}
            fit="cover"
            priority
            sizes="(max-width: 640px) 100vw, 768px"
            className="absolute inset-0 h-full w-full"
            imgClassName="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <button
            type="button"
            aria-label="Close article"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-brand-ink shadow-md backdrop-blur transition hover:bg-white active:scale-95"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wider">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-brand-blue">
                {post.tag}
              </span>
              <span className="inline-flex items-center gap-1.5 text-gray-400">
                <Icon name="calendar" size={13} />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1.5 text-gray-400">
                <Icon name="clock" size={13} />
                5 min read
              </span>
            </div>

            <h1 className="mb-5 font-serif text-2xl font-bold leading-tight text-brand-ink sm:text-3xl md:text-4xl">
              {post.title}
            </h1>

            <p className="mb-8 border-l-4 border-brand-orange pl-4 text-base font-medium italic leading-relaxed text-gray-600 sm:text-lg">
              {post.excerpt}
            </p>

            <div className="space-y-5 text-[15px] leading-relaxed text-gray-700 sm:text-base">
              <p>
                At Early Childhood Montessori &amp; Academy, we believe that the earliest years
                of a child's life shape everything that follows. Our approach is grounded in
                the belief that children are naturally curious, capable, and eager to learn —
                and that the role of the adult is to prepare an environment where that
                curiosity can flourish.
              </p>
              <p>
                Dr. Maria Montessori observed that children move through sensitive periods —
                windows of intense interest in specific skills — and that when these periods
                are respected, learning happens effortlessly. Our classrooms are designed
                around these observations: every material, every shelf, every routine has a
                purpose.
              </p>
              <p>
                Learn more about our approach by speaking with our Montessori educators or
                arranging a visit to the school. We welcome families to observe a session in
                progress and see the method in action.
              </p>
            </div>

            <div className="mt-10 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-6 text-center">
              <h3 className="mb-2 font-serif text-lg font-bold text-brand-ink sm:text-xl">
                Want to see it in person?
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Schedule a tour and see our classrooms in action.
              </p>
              <SiteLink
                to="/contact?reason=School%20visit#message"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-blue-dark hover:shadow-lg"
              >
                Schedule a Visit
              </SiteLink>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}