"use client";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download, Inbox, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/app/primitives";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function DataTable({
  data,
  columns,
  loading,
  searchKeys,
  searchPlaceholder = "Search…",
  pageSize = 8,
  toolbar,
  rowKey,
  onRowClick,
  emptyTitle = "Nothing to show yet",
  emptyDescription = "Records will appear here once they are created.",
  exportable,
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);

  const filtered = useMemo(() => {
    let rows = data ?? [];
    if (query && searchKeys) {
      const q = query.toLowerCase();
      rows = rows.filter((r) => searchKeys(r).toLowerCase().includes(q));
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sortValue) {
        rows = [...rows].sort((a, b) => {
          const av = col.sortValue(a);
          const bv = col.sortValue(b);
          if (av === bv) return 0;
          return (av > bv ? 1 : -1) * (sort.dir === "asc" ? 1 : -1);
        });
      }
    }
    return rows;
  }, [data, query, searchKeys, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * pageSize, current * pageSize);

  return (
    <div className="surface overflow-hidden">
      {(searchKeys || toolbar || exportable) && (
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
          {searchKeys ? (
            <div className="relative w-full md:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="pl-9"
              />
            </div>
          ) : (
            <span />
          )}
          <div className="flex flex-wrap items-center gap-2">
            {toolbar}
            {exportable ? (
              <Button variant="outline" size="sm" onClick={() => toast.success("Export queued — the CSV will be emailed to you.")}>
                <Download className="size-4" aria-hidden /> Export
              </Button>
            ) : null}
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="p-6">
          <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground", col.hideOnMobile && "hidden lg:table-cell", col.className)}
                  >
                    {col.sortValue ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={() =>
                          setSort((s) =>
                            s?.key === col.key ? { key: col.key, dir: s.dir === "asc" ? "desc" : "asc" } : { key: col.key, dir: "asc" },
                          )
                        }
                      >
                        {col.header}
                        {sort?.key === col.key ? (
                          sort.dir === "asc" ? <ArrowUp className="size-3" aria-hidden /> : <ArrowDown className="size-3" aria-hidden />
                        ) : null}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key === "Enter") onRowClick(row);
                        }
                      : undefined
                  }
                  className={cn(
                    "border-b border-border last:border-0 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/60 focus-visible:bg-muted/60",
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3 align-middle", col.hideOnMobile && "hidden lg:table-cell", col.className)}>
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filtered.length > pageSize ? (
        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Showing {(current - 1) * pageSize + 1}–{Math.min(current * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" aria-label="Previous page" disabled={current === 1} onClick={() => setPage(current - 1)}>
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
            <span className="px-2 text-xs font-medium text-muted-foreground">
              {current} / {pageCount}
            </span>
            <Button variant="outline" size="icon" aria-label="Next page" disabled={current === pageCount} onClick={() => setPage(current + 1)}>
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
