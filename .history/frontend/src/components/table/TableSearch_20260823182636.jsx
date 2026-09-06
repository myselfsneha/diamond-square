import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

function TableSearch({
  value = "",
  onChange,
  placeholder = "Search...",
  className = "",
  disabled = false,
}) {
  const clearSearch = () => {
    onChange?.({
      target: {
        value: "",
      },
    });
  };

  return (
    <div className={`relative w-full md:w-80 ${className}`}>
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-11 text-sm text-slate-700 shadow-sm transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-emerald-900/30"
      />

      {value && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={clearSearch}
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          <X size={16} />
        </motion.button>
      )}
    </div>
  );
}

export default TableSearch;