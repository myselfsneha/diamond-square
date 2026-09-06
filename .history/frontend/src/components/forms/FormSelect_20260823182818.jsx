import { ChevronDown, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function FormSelect({
  label,
  value,
  onChange,
  options = [],
  name,
  required = false,
  disabled = false,
  error = "",
  helperText = "",
}) {
  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          {label}
          {required && (
            <span className="text-red-500">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <motion.select
          whileFocus={{ scale: 1.01 }}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full
            appearance-none
            rounded-xl
            border
            bg-white
            dark:bg-slate-900
            py-3
            pl-4
            pr-12
            text-slate-800
            dark:text-white
            transition-all
            duration-300
            focus:outline-none
            focus:ring-4
            disabled:cursor-not-allowed
            disabled:opacity-60
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30"
                : "border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
            }
          `}
        >
          {options.map((item, index) => (
            <option
              key={item.value ?? index}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </motion.select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>

      {helperText && !error && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}

export default FormSelect;