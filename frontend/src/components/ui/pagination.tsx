type Props = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  label: string;
  onChange: (page: number) => void;
  className?: string;
};

const pagesToShow = (page: number, pageCount: number): (number | "gap")[] => {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const out: (number | "gap")[] = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(pageCount - 1, page + 1);
  if (from > 2) out.push("gap");
  for (let i = from; i <= to; i++) out.push(i);
  if (to < pageCount - 1) out.push("gap");
  out.push(pageCount);
  return out;
};

const Pagination = ({
  page,
  pageCount,
  pageSize,
  total,
  label,
  onChange,
  className = "flex items-center justify-between flex-wrap gap-3 p-4",
}: Props) => {
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className={className}>
      <p className="text-sm text-gray-600 mb-0">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {first}–{last}
        </span>{" "}
        of <span className="font-semibold text-gray-900">{total.toLocaleString()}</span>{" "}
        {label}
      </p>
      <nav className="inline-flex items-center gap-1">
        <button
          type="button"
          className="size-9 flex items-center justify-center rounded-full border border-border-color bg-white text-gray-600 hover:bg-light disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Previous"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <i className="icon-chevron-left" />
        </button>

        {pagesToShow(page, pageCount).map((p, i) =>
          p === "gap" ? (
            <span key={`gap-${i}`} className="size-9 flex items-center justify-center text-gray-500">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={
                p === page
                  ? "size-9 flex items-center justify-center rounded-full bg-primary text-white text-sm font-medium"
                  : "size-9 flex items-center justify-center rounded-full border border-border-color bg-white text-gray-600 hover:bg-light text-sm font-medium"
              }
              aria-current={p === page ? "page" : undefined}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          className="size-9 flex items-center justify-center rounded-full border border-border-color bg-white text-gray-600 hover:bg-light disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Next"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
        >
          <i className="icon-chevron-right" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
