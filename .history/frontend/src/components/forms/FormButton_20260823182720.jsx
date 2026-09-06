import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function FormButton({
  children,
  type = "submit",
  color = "primary",
  loading = false,
  disabled = false,
  fullWidth = true,
  icon = null,
  onClick,
}) {
  const colors = {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-300",
    secondary:
      "bg-slate-600 hover:bg-slate-700 focus:ring-slate-300",
    success:
      "bg-green-600 hover:bg-green-700 focus:ring-green-300",
    danger:
      "bg-red-600 hover:bg-red-700 focus:ring-red-300",
    warning:
      "bg-amber-500 hover:bg-amber-600 focus:ring-amber-300",
    info:
      "bg-sky-600 hover:bg-sky-700 focus:ring-sky-300",
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${colors[color] || colors.primary}
        ${fullWidth ? "w-full" : ""}
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        px-5
        py-3
        font-semibold
        text-white
        shadow-md
        transition-all
        duration-300
        focus:outline-none
        focus:ring-4
        disabled:cursor-not-allowed
        disabled:opacity-60
      `}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Please wait...
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  );
}

export default FormButton;