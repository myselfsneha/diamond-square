import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Send,
  Building2,
  CheckCircle2,
  Moon,
  Sun,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const toggleTheme = () => {
    const value = !darkMode;
    setDarkMode(value);

    if (value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const validateEmail = () =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const startCountdown = () => {
    let seconds = 60;
    setCountdown(seconds);

    const timer = setInterval(() => {
      seconds--;

      if (seconds <= 0) {
        clearInterval(timer);
        setCountdown(0);
      } else {
        setCountdown(seconds);
      }
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/forgot-password", {
        email,
      });

      setSubmitted(true);
      startCountdown();

      toast.success(
        res.data.message ||
          "Password reset link sent successfully."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to send reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = () => {
    if (countdown !== 0) return;

    handleSubmit({
      preventDefault: () => {},
    });
  };

  return (
    <div className="min-h-screen overflow-hidden relative flex items-center justify-center px-5 bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 dark:from-slate-950 dark:via-gray-900 dark:to-black">

      {/* Animated Background */}

      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -70, 0],
          y: [0, 70, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
        }}
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl"
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="relative w-full max-w-md"
      >

        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8">

          <button
            onClick={toggleTheme}
            className="absolute top-5 right-5 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md transition"
          >
            {darkMode ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <div className="text-center mb-8">

            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl">

              <Building2 size={38} />

            </div>

            <h1 className="mt-5 text-3xl font-bold text-gray-800 dark:text-white">
              Forgot Password
            </h1>

            <p className="mt-3 text-gray-500 dark:text-gray-400 leading-6">
              Enter your registered email address to receive your password reset link.
            </p>

          </div>
                    {submitted ? (

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="text-center"
            >

              <CheckCircle2
                size={72}
                className="mx-auto text-green-500"
              />

              <h2 className="mt-5 text-2xl font-bold text-gray-800 dark:text-white">
                Check Your Email
              </h2>

              <p className="mt-3 text-gray-600 dark:text-gray-400 leading-7">
                If an approved account exists for{" "}
                <span className="font-semibold">{email}</span>,
                a password reset link has been sent.
              </p>

              <button
                type="button"
                onClick={resendEmail}
                disabled={countdown !== 0}
                className={`mt-7 w-full py-3 rounded-xl font-semibold transition-all ${
                  countdown === 0
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-[1.02] text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                {countdown === 0
                  ? "Resend Email"
                  : `Resend in ${countdown}s`}
              </button>

              <Link
                to="/"
                className="mt-5 flex justify-center items-center gap-2 text-blue-600 hover:underline font-medium"
              >
                <ArrowLeft size={18} />
                Back to Login
              </Link>

            </motion.div>

          ) : (

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>

                <label
                  htmlFor="email"
                  className="block mb-2 font-semibold text-gray-700 dark:text-gray-200"
                >
                  Registered Email
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="name@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold shadow-lg transition-all disabled:opacity-60"
              >

                {loading ? (
                  <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <Send size={18} />
                )}

                {loading
                  ? "Sending Reset Link..."
                  : "Send Reset Link"}

              </button>

              <Link
                to="/"
                className="flex justify-center items-center gap-2 text-blue-600 hover:underline font-medium"
              >
                <ArrowLeft size={18} />
                Back to Login
              </Link>

            </form>

          )}
                    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-5">

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              Diamond Square Society Management System
            </p>

            <p className="mt-1 text-center text-xs font-semibold text-blue-600">
              Version 2.0
            </p>

          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;