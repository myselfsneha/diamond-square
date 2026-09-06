import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  Save,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../components/Navbar";
import TableHeader from "../components/table/TableHeader";

function EditProfile() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser.name || "",
    email: currentUser.email || "",
    phone: currentUser.phone || "",
    flat_number: currentUser.flat_number || "",
    date_of_birth:
      currentUser.date_of_birth || "",
    anniversary_date:
      currentUser.anniversary_date || "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updatedUser = {
        ...currentUser,
        ...formData,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      toast.success(
        "Profile updated successfully!"
      );

      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-10">
        <TableHeader
          title="Edit Profile"
          subtitle="Update your personal information."
        />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 rounded-3xl border border-white/20 bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl shadow-2xl p-8"
        >
          <div className="grid md:grid-cols-2 gap-6">
                      <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                Flat Number
              </label>
              <input
                type="text"
                name="flat_number"
                value={formData.flat_number}
                onChange={handleChange}
                placeholder="Enter flat number"
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                Anniversary Date
              </label>
              <input
                type="date"
                name="anniversary_date"
                value={formData.anniversary_date}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 py-3 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  </div>
);
}

export default EditProfile;