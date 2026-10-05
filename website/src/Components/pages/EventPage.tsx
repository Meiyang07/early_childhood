
import { cn } from '@/lib/utils';
import { Icon, PageBanner } from '../Common';
import { EVENT_DATE_COLORS, EVENT_TAG_COLORS, EVENTS } from '@/lib/constants';
import { JourneySection } from '../Sections';

export default function EventsPage() {
  return (
    <>
      <PageBanner
        title="Events & Activities"
        description="Stay up to date with all the exciting events, celebrations, and activities happening throughout the year."
      />

      <section className="px-0 py-12">
        <div className="mx-auto grid w-[min(100%-24px,970px)] gap-4 md:w-[min(100%-48px,970px)]">
          {EVENTS.map((event) => {
            const tagKey = event.category.toLowerCase();
            return (
              <article
                key={event.title}
                className="flex min-h-0 items-center gap-3 rounded-[17px] border border-[#e2e7ee] bg-white px-4 py-4 shadow-[0_2px_1px_rgba(17,24,39,0.13)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(32,47,97,0.11)] md:min-h-[151px] md:gap-6 md:rounded-[26px] md:px-7 md:py-6"
              >
                <div
                  className={cn(
                    'flex h-[70px] w-[65px] flex-none flex-col items-center justify-center rounded-xl text-white shadow-[0_6px_11px_rgba(23,32,61,0.21)] transition-transform duration-300 md:h-[87px] md:w-[86px] md:rounded-[17px] group-hover:-rotate-[4deg]',
                    EVENT_DATE_COLORS[event.color],
                  )}
                >
                  <strong className="text-[21px] leading-none md:text-[26px]">{event.day}</strong>
                  <span className="mt-0.5 text-[10px] md:text-[13px]">{event.month}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="m-0 text-base leading-snug text-[#263144] md:text-xl">
                      {event.title}
                    </h2>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-px text-[10px] font-semibold md:text-[13px]',
                        EVENT_TAG_COLORS[tagKey],
                      )}
                    >
                      {event.category}
                    </span>
                  </div>
                  <p className="mb-1.5 mt-2 text-xs text-[#6d7d96] md:text-base">
                    {event.description}
                  </p>
                  <small className="flex items-center gap-1.5 text-[11px] text-[#98a8c1] md:text-sm">
                    <Icon name="clock" size={15} /> {event.time}
                  </small>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <JourneySection />
    </>
  );
}