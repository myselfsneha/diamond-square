import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquareWarning, Send, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

function CreateComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
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

    try {
      setLoading(true);

      await api.post("/complaints", form);

      toast.success("Complaint submitted successfully");

      navigate("/complaints");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid md:grid-cols-3 gap-5 mb-8"
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Complaint
                </p>
                <h2 className="text-2xl font-bold mt-2">
                  New
                </h2>
              </div>

              <MessageSquareWarning
                className="text-red-600"
                size={34}
              />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Fields
                </p>
                <h2 className="text-2xl font-bold mt-2">
                  2
                </h2>
              </div>

              <FileText
                className="text-blue-600"
                size={34}
              />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Status
                </p>
                <h2 className="text-2xl font-bold mt-2">
                  Draft
                </h2>
              </div>

              <Send
                className="text-green-600"
                size={34}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-blue-600 mb-8">
            Create Complaint
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            