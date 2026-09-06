import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";
import TableHeader from "../components/table/TableHeader";

function ChangePassword() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await api.put("/users/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success("Password updated successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <Navbar />

      <div className="max-w-xl mx-auto px-6 py-10">
        <TableHeader
          title="Change Password"
          subtitle="Keep your account secure by updating your password."
        />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block mb-2 text-sm font-medium">
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
                        <div>
              <label className="block mb-2 text-sm font-medium">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
export default ChangePassword;