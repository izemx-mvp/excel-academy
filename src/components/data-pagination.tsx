import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DataPagination({
  page,
  pageCount,
  total,
  pageSize,
  onChange,
  label = "éléments",
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
  label?: string;
}) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages: (number | "…")[] = [];
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <p className="text-xs text-muted-foreground">
        {from}–{to} sur <strong>{total}</strong> {label}
      </p>
      <div className="flex items-center gap-1">
        <Button size="icon" variant="outline" className="h-8 w-8" disabled={page === 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-2 text-xs text-muted-foreground">…</span>
          ) : (
            <Button
              key={p}
              size="sm"
              variant={p === page ? "default" : "outline"}
              className={"h-8 min-w-8 px-2 " + (p === page ? "brand-gradient-warm text-white border-0" : "")}
              onClick={() => onChange(p)}
            >
              {p}
            </Button>
          ),
        )}
        <Button size="icon" variant="outline" className="h-8 w-8" disabled={page === pageCount} onClick={() => onChange(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
