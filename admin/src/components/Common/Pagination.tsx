// src/components/Common/Pagination.tsx
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PaginationInfo = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type Props = {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  /** Prevents clicks while a request is in flight */
  disabled?: boolean;
  /** How many numbered buttons to show at once (odd number recommended) */
  windowSize?: number;
  /** Show "Showing X–Y of Z" summary on the left */
  showSummary?: boolean;
  /** Optional className for layout override */
  className?: string;
};

export function Pagination({
  pagination,
  onPageChange,
  disabled = false,
  windowSize = 5,
  showSummary = true,
  className,
}: Props) {
  const { page, totalPages, total, limit, hasPrevPage, hasNextPage } =
    pagination;

  if (totalPages <= 1) return null;

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Build a windowed list of page numbers centered on the current page.
  // e.g. totalPages=20, page=10, windowSize=5 → [8, 9, 10, 11, 12]
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const showLeftEllipsis = start > 2;
  const showRightEllipsis = end < totalPages - 1;

  function go(next: number) {
    if (disabled) return;
    if (next < 1 || next > totalPages || next === page) return;
    onPageChange(next);
  }

  return (
    <nav
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4",
        disabled && "pointer-events-none opacity-70",
        className,
      )}
      aria-label="Pagination"
    >
      {showSummary && (
        <p className="m-0 text-xs text-muted-foreground sm:text-sm">
          Showing <strong className="font-semibold text-foreground">{from}</strong>
          {"–"}
          <strong className="font-semibold text-foreground">{to}</strong> of{" "}
          <strong className="font-semibold text-foreground">{total}</strong>
        </p>
      )}

      <div className="flex items-center gap-1">
        {/* First */}
        <PageIcon
          label="First page"
          onClick={() => go(1)}
          disabled={disabled || !hasPrevPage}
        >
          <ChevronsLeft size={16} />
        </PageIcon>

        {/* Previous */}
        <PageIcon
          label="Previous page"
          onClick={() => go(page - 1)}
          disabled={disabled || !hasPrevPage}
        >
          <ChevronLeft size={16} />
        </PageIcon>

        {/* Leading page + ellipsis */}
        {showLeftEllipsis && (
          <>
            <PageNumber page={1} current={page} onClick={go} disabled={disabled} />
            <Ellipsis />
          </>
        )}

        {/* Window */}
        {pages.map((n) => (
          <PageNumber
            key={n}
            page={n}
            current={page}
            onClick={go}
            disabled={disabled}
          />
        ))}

        {/* Trailing ellipsis + last page */}
        {showRightEllipsis && (
          <>
            <Ellipsis />
            <PageNumber
              page={totalPages}
              current={page}
              onClick={go}
              disabled={disabled}
            />
          </>
        )}

        {/* Next */}
        <PageIcon
          label="Next page"
          onClick={() => go(page + 1)}
          disabled={disabled || !hasNextPage}
        >
          <ChevronRight size={16} />
        </PageIcon>

        {/* Last */}
        <PageIcon
          label="Last page"
          onClick={() => go(totalPages)}
          disabled={disabled || !hasNextPage}
        >
          <ChevronsRight size={16} />
        </PageIcon>
      </div>
    </nav>
  );
}

/* ---------------- Sub-components ---------------- */

function PageIcon({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-lg border border-border bg-transparent",
        "text-foreground transition-colors",
        "hover:border-primary/50 hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
      )}
    >
      {children}
    </button>
  );
}

function PageNumber({
  page,
  current,
  onClick,
  disabled,
}: {
  page: number;
  current: number;
  onClick: (p: number) => void;
  disabled?: boolean;
}) {
  const active = page === current;
  return (
    <button
      type="button"
      onClick={() => onClick(page)}
      disabled={disabled}
      aria-current={active ? "page" : undefined}
      className={cn(
        "grid h-8 min-w-8 place-items-center rounded-lg border px-2 text-sm tabular-nums transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary bg-primary font-semibold text-primary-foreground shadow-sm"
          : "border-border bg-transparent text-foreground hover:border-primary/50 hover:bg-accent hover:text-accent-foreground",
        "disabled:cursor-not-allowed disabled:opacity-40",
      )}
    >
      {page}
    </button>
  );
}

function Ellipsis() {
  return (
    <span
      aria-hidden
      className="select-none px-1 text-sm text-muted-foreground"
    >
      …
    </span>
  );
}