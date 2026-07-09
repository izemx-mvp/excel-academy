import { useEffect, useMemo, useState } from "react";

export function usePagination<T>(items: T[], pageSize = 8) {
  const [page, setPage] = useState(1);
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => { if (page > pageCount) setPage(1); }, [pageCount, page]);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  return { page, setPage, pageCount, total, pageItems, pageSize };
}
