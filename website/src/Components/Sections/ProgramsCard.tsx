;
import { HOME_PROGRAMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { SiteLink } from '../Common';

const TONES = {
  rose: 'bg-[linear-gradient(135deg,#fff2fc,#fcf4ff)] text-brand-ink [&_.text-link]:text-[#c05ad7]',
  sky: 'bg-[linear-gradient(135deg,#eef7ff,#e8fbff)] text-brand-ink [&_.text-link]:text-[#1e66c8]',
  mint: 'bg-[linear-gradient(135deg,#effbf4,#e9fbf7)] text-brand-ink [&_.text-link]:text-[#11905a]',
} as const;

interface ProgramCardsProps {
  expanded?: boolean;
}

export function ProgramCards({ expanded = false }: ProgramCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-9">
      {HOME_PROGRAMS.map((program) => (
        <article
          key={program.title}
          id={expanded ? program.id : undefined}
          className={cn(
            'group relative isolate rounded-[17px] px-8 pb-8 pt-8 transition-[translate,box-shadow] duration-300',
            'hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(32,47,97,0.12)]',
            'md:min-h-[390px] lg:min-h-[412px]',
            TONES[program.color],
          )}
        >
          <span className="inline-block text-[28px] transition-transform duration-300 group-hover:animate-icon-bounce">
            {program.emoji}
          </span>
          <h3 className="mb-2 mt-3 text-xl font-medium">{program.title}</h3>
          <p className="mb-3 text-[15px] text-[#445366]">{program.age}</p>
          <ul className="mb-5 list-none space-y-2 p-0">
            {program.points.map((point) => (
              <li key={point} className="text-[15px] text-[#4e5b67] before:content-['-_']">
                {point}
              </li>
            ))}
          </ul>
          <SiteLink
            to={expanded ? '/contact?reason=Program%20inquiry#message' : `/programs#${program.id}`}
            className="text-link inline-flex items-center gap-1 text-base font-semibold transition hover:underline"
          >
            Learn More <span aria-hidden="true">→</span>
          </SiteLink>
        </article>
      ))}
    </div>
  );
}