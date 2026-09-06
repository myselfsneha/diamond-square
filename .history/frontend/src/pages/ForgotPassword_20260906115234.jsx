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
                    {!sent ? (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Registered Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@example.com"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Send Reset Link"
                )}
              </button>

            </form>
          ) : (
            <div className="mt-8 rounded-2xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 p-5 text-center">

              <CheckCircle
                size={42}
                className="mx-auto text-green-600 mb-3"
              />

              <h2 className="text-lg font-semibold">
                Email Sent
              </h2>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                If an account exists with this email, you'll receive password reset instructions shortly.
              </p>

            </div>
          )}

          <Link
            to="/"
            className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 font-semibold hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition"
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>