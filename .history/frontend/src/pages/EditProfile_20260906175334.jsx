import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    flat_number: "",
    date_of_birth: "",
    anniversary_date: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/profile");

      const user = res.data.user || res.data;

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        flat_number: user.flat_number || "",
        date_of_birth: user.date_of_birth
          ? user.date_of_birth.slice(0, 10)
          : "",
        anniversary_date: user.anniversary_date
          ? user.anniversary_date.slice(0, 10)
          : "",
      });
    } catch (err) {
      console.error(err);

      const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        flat_number: currentUser.flat_number || "",
        date_of_birth: currentUser.date_of_birth || "",
        anniversary_date:
          currentUser.anniversary_date || "",
      });

      toast.error("Failed to load profile.");
    }
  };

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

      const res = await api.put("/profile", formData);

      const updatedUser =
        res.data.user || {
          ...JSON.parse(localStorage.getItem("user") || "{}"),
          ...formData,
        };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      toast.success("Profile updated successfully!");

      navigate("/profile");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 dark:text-white">
            Edit Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium dark:text-white">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium dark:text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium dark:text-white">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium dark:text-white">
                Flat Number
              </label>
              <input
                type="text"
                name="flat_number"
                value={formData.flat_number}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled
              />
            </div>

            <div>
              <label className="block mb-2 font-medium dark:text-white">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium dark:text-white">
                Anniversary
              </label>
              <input
                type="date"
                name="anniversary_date"
                value={formData.anniversary_date}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;