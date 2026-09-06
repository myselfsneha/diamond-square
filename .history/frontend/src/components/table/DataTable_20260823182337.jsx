import { useMemo, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

function DataTable({
  columns = [],
  data = [],
  keyField = "id",
  searchable = true,
  pagination = true,
  pageSize = 10,
  striped = true,
  compact = false,
  emptyMessage = "No data available",
}) {
  if (!Array.isArray(columns)) columns = [];
  if (!Array.isArray(data)) data = [];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredData = useMemo(() => {
    let rows = [...data];

    if (search.trim()) {
      const query = search.toLowerCase();

      rows = rows.filter((row) =>
        columns.some((col) =>
          String(row[col.key] ?? "")
            .toLowerCase()
            .includes(query)
        )
      );
    }

    if (sortKey) {
      rows.sort((a, b) => {
        const first = a[sortKey];
        const second = b[sortKey];

        if (first == null) return 1;
        if (second == null) return -1;

        if (typeof first === "number" && typeof second === "number") {
          return sortOrder === "asc"
            ? first - second
            : second - first;
        }

        return sortOrder === "asc"
          ? String(first).localeCompare(String(second))
          : String(second).localeCompare(String(first));
      });
    }

    return rows;
  }, [data, search, sortKey, sortOrder, columns]);

  const totalPages = pagination
    ? Math.max(1, Math.ceil(filteredData.length / pageSize))
    : 1;

  const paginatedData = pagination
    ? filteredData.slice(
        (page - 1) * pageSize,
        page * pageSize
      )
    : filteredData;

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
      {searchable && (
        <div className="border-b border-slate-200 p-4 dark:border-slate-700">
          <div className="relative max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-emerald-600 text-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() =>
                    col.sortable !== false &&
                    handleSort(col.key)
                  }
                  className={`px-5 ${
                    compact ? "py-3" : "py-4"
                  } text-left text-sm font-semibold whitespace-nowrap ${
                    col.sortable !== false
                      ? "cursor-pointer select-none"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {col.label}

                    {col.sortable !== false && (
                      <ArrowUpDown size={15} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row[keyField] ?? index}
                  className={`border-b transition hover:bg-emerald-50 dark:border-slate-700 dark:hover:bg-slate-800 ${
                    striped && index % 2
                      ? "bg-slate-50 dark:bg-slate-900/50"
                      : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 ${
                        compact ? "py-3" : "py-4"
                      } text-sm text-slate-700 dark:text-slate-200`}
                    >
                      {col.render
                        ? col.render(row)
                        : row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && filteredData.length > pageSize && (
        <div className="flex items-center justify-between border-t border-slate-200 p-4 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {(page - 1) * pageSize + 1}-
            {Math.min(
              page * pageSize,
              filteredData.length
            )}{" "}
            of {filteredData.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              disabled={page === 1}
              className="rounded-lg border border-slate-300 p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="min-w-[70px] text-center text-sm font-medium">
              {page} / {totalPages}
            </span>

            <button
              onClick={() =>
                setPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              disabled={page === totalPages}
              className="rounded-lg border border-slate-300 p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-800"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;