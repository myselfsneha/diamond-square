import { motion } from "framer-motion";
import { Plus } from "lucide-react";

function TableHeader({
  title,
  subtitle,
  buttonText,
  onClick,
  buttonIcon = <Plus size={18} />,
  disabled = false,
  children,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {children}

        {buttonText && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {buttonIcon}
            {buttonText}
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default TableHeader;