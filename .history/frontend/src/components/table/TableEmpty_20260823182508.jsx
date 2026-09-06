import { SearchX } from "lucide-react";
import { motion } from "framer-motion";

function TableEmpty({
  message = "No records found",
  title = "Nothing to display",
  description = "There are no records available at the moment.",
  action = null,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-card dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
        <SearchX
          size={38}
          className="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      <h2 className="text-xl font-bold text-slate-800 dark:text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>

      <p className="mt-4 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        {message}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </motion.div>
  );
}

export default TableEmpty;