import { useState } from 'react';

import type { BlogPost } from '@/types';
import { Container, PageBanner } from '../Common';
import { POSTS } from '@/lib/constants';
import { ArticleDialog, BlogCard } from '../Blog';
import { JourneySection } from '../Sections';

export default function BlogPage() {
  const [selected, setSelected] = useState<BlogPost | null>(null);

  return (
    <>
      <PageBanner
        title="Blog & Insights"
        description="Thoughtful articles, expert tips, and heartwarming stories from our Montessori educators and child development team."
      />

      <section className="bg-[#f0f6ff] px-5 md:px-12 py-6">
        <Container className="grid grid-cols-1 gap-4 md:gap-7 lg:grid-cols-3 ">
          {POSTS.map((post) => (
            <BlogCard key={post.title} post={post} onRead={setSelected} />
          ))}
        </Container>
      </section>

      {selected && <ArticleDialog post={selected} onClose={() => setSelected(null)} />}

      <JourneySection />
    </>
  );
}