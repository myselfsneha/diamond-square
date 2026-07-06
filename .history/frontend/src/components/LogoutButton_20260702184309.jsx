import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all stored authentication data
    localStorage.clear();

    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
    >
      Logout
    </button>
  );
}

export default LogoutButton;