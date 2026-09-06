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
            