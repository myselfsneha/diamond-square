import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function LogoutButton() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      sessionStorage.clear();
      localStorage.clear();

      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 900);
    } catch {
      toast.error("Unable to logout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={handleLogout}
      disabled={loading}
      aria-label="Logout"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white shadow-md transition-all duration-300 hover:bg-red-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut size={18} />
          Logout
        </>
      )}
    </motion.button>
  );
}

export default LogoutButton;