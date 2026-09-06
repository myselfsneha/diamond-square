import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  required = false,
  disabled = false,
  readOnly = false,
  maxLength,
  helperText = "",
  error = "",
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

      <motion.textarea
        whileFocus={{ scale: 1.01 }}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        className={`
          w-full
          resize-y
          rounded-xl
          border
          bg-white
          dark:bg-slate-900
          px-4
          py-3
          text-slate-800
          dark:text-white
          placeholder:text-slate-400
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
      />

      <div className="mt-2 flex items-center justify-between">
        {helperText && !error ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        ) : (
          <span />
        )}

        {maxLength && (
          <span className="text-xs text-slate-400">
            {String(value || "").length}/{maxLength}
          </span>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}

export default FormTextarea;