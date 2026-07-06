import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminSettings() {

  // ===========================
  // Settings form state
  // ===========================
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

  // Load settings once
  useEffect(() => {
    fetchSettings();
  }, []);

  // Fetch settings from backend
  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      setForm(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle all input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox"
          ? (e.target.checked ? 1 : 0)
          : e.target.value,
    });
  };

  // Save settings
  const saveSettings = async (e) => {
    e.preventDefault();

    try {
      await api.put("/settings", form);
      alert("Settings updated successfully.");
    } catch (err) {
      console.log(err);
      alert("Failed to update settings.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Navigation */}
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">

        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Society Settings
        </h1>

        {/* Settings Card */}
        <div className="bg-white rounded-xl shadow p-6">

          {/* IMPORTANT:
             Keep the form OPEN.
             Do NOT write </form> here.
          */}
          <form
            onSubmit={saveSettings}
            className="grid md:grid-cols-2 gap-4"
          >

            {/* Society Name */}
            <input
              type="text"
              name="society_name"
              placeholder="Society Name"
              value={form.society_name}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            {/* Address */}
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            {/* City */}
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            {/* State */}
            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            {/* Pincode */}
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            {/* Contact Email */}
            <input
              type="email"
              name="contact_email"
              placeholder="Contact Email"
              value={form.contact_email}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />             {/* Contact Phone */}
            <input
              type="text"
              name="contact_phone"
              placeholder="Contact Phone"
              value={form.contact_phone}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            {/* Maintenance Due Day */}
            <input
              type="number"
              name="maintenance_due_day"
              placeholder="Maintenance Due Day"
              value={form.maintenance_due_day}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            {/* Late Fee */}
            <input
              type="number"
              name="late_fee"
              placeholder="Late Fee"
              value={form.late_fee}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            {/* Complaint Auto Close Days */}
            <input
              type="number"
              name="complaint_auto_close_days"
              placeholder="Complaint Auto Close Days"
              value={form.complaint_auto_close_days}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            {/* Visitor Approval Setting */}
            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                name="visitor_approval_required"
                checked={form.visitor_approval_required === 1}
                onChange={handleChange}
              />
              Visitor Approval Required
            </label>

            {/* Save Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg md:col-span-2"
            >
              Save Settings
            </button>
                      </form>
          {/* End Settings Form */}

        </div>
        {/* End Card */}

      </div>
      {/* End Container */}

    </div>
  );
}

export default AdminSettings;