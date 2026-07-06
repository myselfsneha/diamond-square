import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
    >
      Logout
    </button>
  );
}

export default LogoutButton;