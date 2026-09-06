import { useState } from "react";
import {
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  error = "",
  helperText = "",
  icon = null,
  autoComplete = "off",
  maxLength,
  min,
  max,
  readOnly = false,
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

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
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <motion.input
          whileFocus={{ scale: 1.01 }}
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          maxLength={maxLength}
          min={min}
          max={max}
          className={`
            w-full
            rounded-xl
            border
            bg-white
            dark:bg-slate-900
            text-slate-800
            dark:text-white
            placeholder:text-slate-400
            py-3
            transition-all
            duration-300
            focus:outline-none
            focus:ring-4
            disabled:cursor-not-allowed
            disabled:opacity-60
            ${
              icon
                ? "pl-12"
                : "pl-4"
            }
            ${
              type === "password"
                ? "pr-12"
                : "pr-4"
            }
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30"
                : "border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
            }
          `}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-emerald-600"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}
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

export default FormInput;