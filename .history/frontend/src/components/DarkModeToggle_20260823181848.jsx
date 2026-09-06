import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92, rotate: 180 }}
      onClick={() => setDarkMode(!darkMode)}
      type="button"
      aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-pressed={darkMode}
      title={darkMode ? "Light Mode" : "Dark Mode"}
      className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-white text-slate-700 shadow-soft transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:bg-slate-700 dark:hover:text-emerald-400 dark:focus:ring-offset-slate-900"
    >
      <motion.div
        key={darkMode ? "sun" : "moon"}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.25 }}
      >
        {darkMode ? (
          <Sun
            size={20}
            className="text-amber-400 transition-colors duration-300"
          />
        ) : (
          <Moon
            size={20}
            className="text-slate-700 transition-colors duration-300 dark:text-slate-200"
          />
        )}
      </motion.div>

      <span className="absolute inset-0 rounded-full bg-emerald-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.button>
  );
};

export default DarkModeToggle;