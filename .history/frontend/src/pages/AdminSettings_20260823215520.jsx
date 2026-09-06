// Part 1/2

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

import TableHeader from "../components/table/TableHeader";

const DEFAULT_SETTINGS = {
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
};

function AdminSettings() {
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/settings");

      setForm({
        ...DEFAULT_SETTINGS,
        ...(res.data || {}),
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings.");
      setForm(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = ({ target }) => {
    const value =
      target.type === "checkbox"
        ? target.checked
          ? 1
          : 0
        : target.type === "number"
        ? Number(target.value)
        : target.value;

    setForm((prev) => ({
      ...prev,
      [target.name]: value,
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

      toast.error(
        error.response?.data?.message ||
          "Failed to update settings."
      );
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
        <TableHeader
          title="Society Settings"
          subtitle="Manage society configuration"
          buttonText="Refresh"
          onButtonClick={fetchSettings}
        />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <form
            onSubmit={saveSettings}
            className="grid md:grid-cols-2 gap-4"
          >