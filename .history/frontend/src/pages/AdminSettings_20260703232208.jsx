import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminSettings() {
  const [form, setForm] = useState({
    society_name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contact_email: "",
    contact_phone: "",
    maintenance_due_day: 10,
    late_fee: 0,
    visitor_approval_required: 1,
    complaint_auto_close_days: 30,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const res = await api.get("/settings");
      setForm(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = ({ target }) => {
    setForm((prev) => ({
      ...prev,
      [target.name]:
        target.type === "checkbox"
          ? target.checked
            ? 1
            : 0
          : target.value,
    }));
  };

  const saveSettings = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put("/settings", form);

      toast.success("Settings updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <div className="flex justify-center items-center h-[70vh]">
  <p className="text-lg text-gray-600 dark:text-gray-300">
    Loading settings...
  </p>
</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
  Society Settings
</h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <form
            onSubmit={saveSettings}
            className="grid md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="society_name"
              placeholder="Society Name"
              value={form.society_name}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="email"
              name="contact_email"
              placeholder="Contact Email"
              value={form.contact_email}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="text"
              name="contact_phone"
              placeholder="Contact Phone"
              value={form.contact_phone}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="number"
              name="maintenance_due_day"
              placeholder="Maintenance Due Day"
              value={form.maintenance_due_day}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="number"
              name="late_fee"
              placeholder="Late Fee"
              value={form.late_fee}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="number"
              name="complaint_auto_close_days"
              placeholder="Complaint Auto Close Days"
              value={form.complaint_auto_close_days}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                name="visitor_approval_required"
                checked={form.visitor_approval_required === 1}
                onChange={handleChange}
              />
              Visitor Approval Required
            </label>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg md:col-span-2"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;