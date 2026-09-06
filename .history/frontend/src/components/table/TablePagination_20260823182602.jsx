import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function TablePagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize,
  onPrevious,
  onNext,
  onPageChange,
}) {
  const pages = [];

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const startItem =
    totalItems && pageSize
      ? (currentPage - 1) * pageSize + 1
      : null;

  const endItem =
    totalItems && pageSize
      ? Math.min(currentPage * pageSize, totalItems)
      : null;

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-500 dark:text-slate-400">
        {totalItems && pageSize ? (
          <>
            Showing <span className="font-semibold">{startItem}</span> -{" "}
            <span className="font-semibold">{endItem}</span> of{" "}
            <span className="font-semibold">{totalItems}</span>
          </>
        ) : (
          <>
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
        >
          <ChevronLeft size={18} />
          Previous
        </motion.button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() =>
              onPageChange
                ? onPageChange(page)
                : page < currentPage
                ? onPrevious?.()
                : page > currentPage
                ? onNext?.()
                : null
            }
            className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${
              page === currentPage
                ? "bg-emerald-600 text-white shadow-md"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            }`}
          >
            {page}
          </button>
        ))}

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}

export default TablePagination;