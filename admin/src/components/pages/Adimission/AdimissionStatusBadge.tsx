import { cn } from "@/lib/utils";
import { AdmissionStatus } from "@/types/adimission";


const styles: Record<AdmissionStatus, string> = {
  Pending:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30",
  Reviewed:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30",
  Accepted:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30",
  Rejected:
    "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30",
  Waitlisted:
    "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/30",
};

export function AdmissionStatusBadge({ status }: { status: AdmissionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}