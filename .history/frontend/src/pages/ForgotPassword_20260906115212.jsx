import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LockKeyhole,
  Mail,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your registered email.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", {
        email,
      });

      setSent(true);

      toast.success(
        "Password reset instructions have been sent to your email."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to process request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 via-indigo-200 to-blue-300 dark:from-slate-950 dark:via-gray-900 dark:to-black px-5">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >

        <div className="backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border border-white/20 p-8">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl mb-6">
            {sent ? (
              <CheckCircle size={36} />
            ) : (
              <LockKeyhole size={36} />
            )}
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Forgot Password
          </h1>

          <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
            Enter your registered email address and we'll send password reset instructions.
          </p>
          