// Part 1/2

import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.put("/users/change-password", form);

      alert("Password updated successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.error(
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-4">
          Change Password
        </h1>

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4"
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border p-3 rounded mb-4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ChangePassword;