
import { cn } from '@/lib/utils';
import { Container, Icon, SectionHeading } from '../Common';
import { ADMISSION_BREAKDOWN, DOT_COLORS, PROGRAM_ACTIVITIES, PROGRAM_CALLOUTS, SCHOOL_PROGRAMS } from '@/lib/constants';

const CARD_TONES: Record<string, string> = {
  baby: 'bg-[#dceafe] border-[#b19de0] text-brand-ink',
  white: 'bg-white border-brand-blue text-brand-ink',
  'white-dark': 'bg-white border-brand-blue text-brand-ink',
  blue: 'bg-brand-blue text-white border-brand-blue',
  slate: 'bg-[#4b586a] text-white border-[#a4aec0]',
  sand: 'bg-[#f3f0e7] border-brand-blue text-brand-ink',
};

export default function ProgramsPage() {
  return (
    <>
      {/* Programs */}
      <section className="bg-[#fffbea] pb-12 pt-8">
        <Container>
          <SectionHeading
            title="Our Educational Programs"
            subtitle="Age-appropriate programs designed to nurture curiosity, independence, and a love of learning at every stage."
            as="h1"
            showLine
            className="mb-8 md:px-12 px-5"
          />

          {/* Program Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 px-5 md:px-20">
            {SCHOOL_PROGRAMS.map((program) => (
              <article
                key={program.id}
                id={program.id}
                className={cn(
                  'relative isolate scroll-mt-32 rounded-2xl border-2 p-5 transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(32,47,97,0.12)] md:min-h-[211px] md:p-6',
                  CARD_TONES[program.tone],
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'rounded-[25px] px-3.5 py-1 text-[11px] font-semibold',
                      program.tone === 'blue'
                        ? 'bg-transparent p-0'
                        : program.tone === 'slate'
                          ? 'bg-[#9da7ba] text-white'
                          : program.tone === 'baby'
                            ? 'bg-[#293647] text-white'
                            : 'bg-brand-blue text-white',
                    )}
                  >
                    {program.age}
                  </span>
                  <span
                    className={cn(
                      'grid h-9 w-9 place-items-center rounded-xl transition-transform duration-300 group-hover:-translate-y-1',
                      program.tone === 'blue' || program.tone === 'slate'
                        ? 'bg-transparent text-white'
                        : 'bg-brand-blue text-white',
                    )}
                  >
                    <Icon name={program.icon} size={23} />
                  </span>
                </div>
                <h2 className="mb-2.5 mt-4 font-serif text-lg font-bold leading-tight md:text-[22px]">
                  {program.title}
                </h2>
                <p
                  className={cn(
                    'm-0 text-[13px] leading-relaxed',
                    program.tone === 'blue' || program.tone === 'slate'
                      ? 'text-white/90'
                      : 'text-[#61708b]',
                  )}
                >
                  {program.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Breakdown */}
      <section className="px-0 py-7 px-5 md:py-12 md:px-20">
        <Container >
          <div className="mb-7 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-blue text-white">
              <Icon name="users" size={23} />
            </span>
            <div>
              <h2 className="m-0 font-serif text-xl font-bold md:text-[25px]">Admission Breakdown</h2>
              <p className="m-0 mt-0.5 text-xs text-[#657796] md:text-sm">
                Program structure, class duration, and capacity at a glance.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#dfe4ee] shadow-[0_2px_3px_rgba(22,36,76,0.09)]">
            <table className="w-full min-w-[780px] border-collapse text-left">
              <thead>
                <tr>
                  {['Program', 'Age Range', 'Class Duration', 'No. of Teachers', 'No. of Children'].map((h) => (
                    <th
                      key={h}
                      className="border-r border-white/10 bg-brand-blue px-5 py-5 font-lora text-sm font-bold text-white"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ADMISSION_BREAKDOWN.map((row, i) => (
                  <tr key={row.program} className={i % 2 === 1 ? 'bg-[#f4f6fc]' : ''}>
                    <td className="whitespace-nowrap border-b border-[#e6e9f0] px-5 py-4 text-[13px] font-semibold last:border-b-0">
                      <span
                        className={cn('mr-2.5 inline-block h-2.5 w-2.5 rounded-full', DOT_COLORS[row.dot])}
                      />
                      {row.program}
                    </td>
                    <td className="border-b border-[#e6e9f0] px-5 py-4 text-[13px] text-[#574f4e]">
                      {row.age}
                    </td>
                    <td className="border-b border-[#e6e9f0] px-5 py-4 text-[13px] text-[#574f4e]">
                      {row.duration}
                    </td>
                    <td className="border-b border-[#e6e9f0] px-5 py-4 text-[13px] text-[#574f4e]">
                      {row.teachers}
                      {'teacherNote' in row && (
                        <small className="block text-[11px] text-[#7081a2]">{row.teacherNote}</small>
                      )}
                    </td>
                    <td className="border-b border-[#e6e9f0] px-5 py-4 text-[13px] text-[#574f4e]">
                      {row.children}
                      {'childrenNote' in row && (
                        <small className="block text-[11px] text-[#7081a2]">{row.childrenNote}</small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {PROGRAM_CALLOUTS.map((text, i) => (
              <p
                key={text}
                className={cn(
                  'rounded-2xl border px-4 py-3 text-sm leading-tight md:text-base',
                  i === 0
                    ? 'bg-[#111] text-white border-[#111]'
                    : i === PROGRAM_CALLOUTS.length - 1
                      ? 'bg-[#e9fbf2] text-[#138c69] border-[#b4e8d1]'
                      : 'bg-[#f1f3fa] text-[#37518a] border-[#bcd0e8]',
                )}
              >
                {text}
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* Activities */}
      <section className="bg-[#edf1ff] px-0 py-11 text-center px-5 md:py-20 md:px-20">
        <Container>
          <h2 className="mb-8 font-serif text-xl font-bold md:text-[25px]">Montessori Activities</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {PROGRAM_ACTIVITIES.map((a) => (
              <div
                key={a.label}
                className="group flex min-h-[82px] flex-col items-center justify-center gap-3 rounded-2xl border border-[#dce1ed] bg-white p-2 text-[11px] shadow-[0_2px_1px_rgba(40,60,130,0.11)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(32,47,97,0.11)] md:text-[13px]"
              >
                <Icon
                  name={a.icon}
                  size={22}
                  className="text-brand-blue transition-transform duration-300 group-hover:rotate-[-9deg] group-hover:scale-110"
                />
                <span>{a.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}