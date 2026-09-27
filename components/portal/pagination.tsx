import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  baseUrl: string;
}

export function Pagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1 && totalCount <= pageSize) return null;

  const startRecord = Math.min((page - 1) * pageSize + 1, totalCount);
  const endRecord = Math.min(page * pageSize, totalCount);

  const prevPage = Math.max(page - 1, 1);
  const nextPage = Math.min(page + 1, totalPages);

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-[var(--line)] px-2 py-4 sm:flex-row">
      <p className="text-xs text-[var(--muted)]">
        Showing <span className="font-semibold text-[var(--ink)]">{startRecord}</span> to{" "}
        <span className="font-semibold text-[var(--ink)]">{endRecord}</span> of{" "}
        <span className="font-semibold text-[var(--ink)]">{totalCount}</span> records
      </p>

      <div className="flex items-center gap-1.5">
        <Link
          href={`${baseUrl}?page=${prevPage}`}
          aria-disabled={page <= 1}
          className={`inline-flex items-center gap-1 rounded-lg border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink)] shadow-sm transition ${
            page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-[var(--surface-muted)]"
          }`}
        >
          <ChevronLeft size={14} />
          <span>Previous</span>
        </Link>

        <span className="px-2 text-xs font-semibold text-[var(--muted)]">
          Page {page} of {Math.max(totalPages, 1)}
        </span>

        <Link
          href={`${baseUrl}?page=${nextPage}`}
          aria-disabled={page >= totalPages}
          className={`inline-flex items-center gap-1 rounded-lg border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink)] shadow-sm transition ${
            page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-[var(--surface-muted)]"
          }`}
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
