import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        "/users/change-password",
        form
      );

      alert("Password updated");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">
          Change Password
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Current Password"
            className="w-full border p-3 rounded mb-4"
            onChange={(e) =>
              setForm({
                ...form,
                currentPassword: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-3 rounded mb-4"
            onChange={(e) =>
              setForm({
                ...form,
                newPassword: e.target.value,
              })
            }
          />

          <button
            className="w-full bg-blue-600 text-white p-3 rounded"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;