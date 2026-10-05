
import { POST_TAG_COLORS } from '@/lib/constants';
import { asset, cn } from '@/lib/utils';
import type { BlogPost } from '@/types';
import { Icon, Image } from '../Common';

interface BlogCardProps {
  post: BlogPost;
  onRead: (post: BlogPost) => void;
}

export function BlogCard({ post, onRead }: BlogCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[26px] border border-[#e5e8ef] bg-white shadow-[0_2px_2px_rgba(22,33,58,0.09)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(32,47,97,0.12)]">
      <div className="relative overflow-hidden">
        <Image
          src={asset(post.image)}
          alt=""
          aspectRatio="16/9"
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          imgClassName="group-hover:scale-105"
        />
        <span
          className={cn(
            'absolute left-4 top-4 rounded-full px-3 py-1 text-[13px] font-semibold text-[#29374e]',
            POST_TAG_COLORS[post.color],
          )}
        >
          {post.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
        <small className="flex items-center gap-1.5 text-[13px] text-[#93a5bc]">
          <Icon name="clock" size={15} /> {post.date}
        </small>
        <h2 className="mb-3 mt-4 text-[17px] leading-snug text-[#273246] lg:text-[19px]">
          {post.title}
        </h2>
        <p className="mb-5 mt-0 flex-1 text-sm leading-snug text-[#62758c] lg:text-base">
          {post.excerpt}
        </p>
        <button
          type="button"
          onClick={() => onRead(post)}
          className="mt-auto inline-flex items-center gap-1 self-start border-0 bg-transparent p-0 text-[15px] font-semibold text-[#4298d5] hover:underline"
        >
          Read Article
          <Icon name="arrow" size={17} className="transition-transform duration-300 hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}