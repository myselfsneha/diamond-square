import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition"
    >
      {darkMode ? (
        <Sun className="text-yellow-400" size={20} />
      ) : (
        <Moon className="text-gray-800" size={20} />
      )}
    </button>
  );
};

export default DarkModeToggle;