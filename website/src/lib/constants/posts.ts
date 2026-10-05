import type { BlogPost } from '@/types';

export const POSTS: BlogPost[] = [
  {
    image: 'blog-montessori.png',
    tag: 'Montessori',
    date: 'Dec 10, 2024',
    title: '5 Ways Montessori Education Benefits Your Child',
    excerpt:
      'Discover how the Montessori method builds independence, creativity, and a deep love of learning from the very earliest years of life.',
    color: 'blue',
  },
  {
    image: 'blog-parenting.jpg',
    tag: 'Parenting',
    date: 'Nov 28, 2024',
    title: "Supporting Your Child's Learning at Home",
    excerpt:
      'Simple, effective strategies for Montessori-inspired activities that complement school learning and strengthen family bonds.',
    color: 'green',
  },
  {
    image: 'blog-outdoor.jpg',
    tag: 'Activities',
    date: 'Nov 15, 2024',
    title: 'The Importance of Outdoor Play in Early Childhood',
    excerpt:
      'Research shows outdoor play is essential for cognitive, physical, and emotional development. Here is how we bring it to life every day.',
    color: 'yellow',
  },
  {
    image: 'blog-school-life.jpg',
    tag: 'School Life',
    date: 'Oct 30, 2024',
    title: 'Annual Day 2024: A Celebration of Young Talent',
    excerpt:
      "Our Annual Day was a spectacular showcase of students' creativity, confidence, and love for the performing arts in Pokhara.",
    color: 'orange',
  },
  {
    image: 'blog-cultural.jpg',
    tag: 'Cultural',
    date: 'Oct 14, 2024',
    title: 'Holi Festival: Colors, Joy & Community',
    excerpt:
      'Our annual Holi celebration brought together students, teachers, and parents in a vibrant explosion of color and laughter.',
    color: 'purple',
  },
  {
    image: 'blog-admissions.png',
    tag: 'Admissions',
    date: 'Oct 1, 2024',
    title: "What to Expect in Your Child's First Week",
    excerpt:
      'Transition tips and what the first week at Early Childhood Education Centre looks like — for both excited children and their parents.',
    color: 'teal',
  },
];

export const POST_TAG_COLORS: Record<string, string> = {
  blue: 'bg-[#6ed0ff]',
  green: 'bg-[#a2d854]',
  yellow: 'bg-[#ffe486]',
  orange: 'bg-[#fa855c]',
  purple: 'bg-[#ad70d1]',
  teal: 'bg-[#3cae9d]',
};