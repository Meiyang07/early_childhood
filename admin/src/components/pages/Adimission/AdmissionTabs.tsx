import { cn } from "@/lib/utils";
import { AdmissionCounts, AdmissionStatus } from "@/types/adimission";

type Tab = "All" | AdmissionStatus;

const TABS: Tab[] = [
  "All",
  "Pending",
  "Reviewed",
  "Accepted",
  "Rejected",
  "Waitlisted",
];

const dotColor: Record<Tab, string> = {
  All: "bg-foreground/60",
  Pending: "bg-amber-500",
  Reviewed: "bg-blue-500",
  Accepted: "bg-emerald-500",
  Rejected: "bg-rose-500",
  Waitlisted: "bg-violet-500",
};

export function AdmissionStatusTabs({
  value,
  onChange,
  counts,
}: {
  value: string;
  onChange: (value: string) => void;
  counts: AdmissionCounts;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-card p-1.5">
      {TABS.map((tab) => {
        const active = value === tab;
        const count = counts[tab] ?? 0;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                active ? "bg-primary-foreground" : dotColor[tab],
              )}
            />
            <span>{tab}</span>
            <span
              className={cn(
                "inline-flex min-w-[1.35rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                active
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}