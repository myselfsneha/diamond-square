import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

const DEFAULT_SETTINGS = {
  society_name: "Diamond Square",
  contact_email: "admin@diamondsquare.com",
  maintenance_cycle: "Monthly",
};

function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const res = await api.get("/settings");

      setSettings({
        society_name:
          res.data.society_name ||
          DEFAULT_SETTINGS.society_name,
        contact_email:
          res.data.contact_email ||
          DEFAULT_SETTINGS.contact_email,
        maintenance_cycle:
          res.data.maintenance_cycle ||
          DEFAULT_SETTINGS.maintenance_cycle,
      });
    } catch (error) {
      console.log(error);
      toast.warning(
        "Using default settings. Settings not found."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      await api.put("/settings", settings);

      toast.success("Settings updated successfully.");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold dark:text-white mb-6">
          Admin Settings
        </h1>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            Loading settings...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="font-bold mb-2 dark:text-white">
                Society Name
              </h2>

              <input
                type="text"
                name="society_name"
                value={settings.society_name}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="font-bold mb-2 dark:text-white">
                Contact Email
              </h2>

              <input
                type="email"
                name="contact_email"
                value={settings.contact_email}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="font-bold mb-2 dark:text-white">
                Maintenance Cycle
              </h2>

              <select
                name="maintenance_cycle"
                value={settings.maintenance_cycle}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-end">
              <button
                onClick={saveSettings}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSettings;