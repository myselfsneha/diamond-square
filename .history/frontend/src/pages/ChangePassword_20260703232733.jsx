import { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

import TableHeader from "../components/table/TableHeader";

function ChangePassword() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put("/users/change-password", form);

      toast.success("Password updated successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-md mx-auto p-6">
        <TableHeader
          title="Change Password"
          subtitle="Update your account password securely."
        />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg"
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>
                  </div>

  );
}

export default ChangePassword;