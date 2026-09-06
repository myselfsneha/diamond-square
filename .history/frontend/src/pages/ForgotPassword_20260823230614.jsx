import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Send,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Moon,
  Sun,
} from "lucide-react";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const validateEmail = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);

      toast.success(
        "If your account is approved by the admin, password reset instructions have been sent."
      );
    }, 1800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-indigo-100 to-blue-200 dark:from-slate-950 dark:via-gray-900 dark:to-black px-5 relative overflow-hidden">

      {/* Background Blobs */}

      <motion.div
        animate={{
          x: [0, 70, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute w-80 h-80 bg-blue-500/20 blur-3xl rounded-full -top-20 -left-20"
      />

      <motion.div
        animate={{
          x: [0, -70, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
        }}
        className="absolute w-96 h-96 bg-purple-500/20 blur-3xl rounded-full bottom-0 right-0"
      />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        className="relative w-full max-w-md"
      >

        <div className="backdrop-blur-2xl bg-white/90 dark:bg-gray-900/85 rounded-3xl border border-white/20 shadow-2xl p-8">

          {/* Theme Toggle */}

          <button
            onClick={toggleTheme}
            className="absolute top-5 right-5 bg-white dark:bg-gray-800 rounded-full p-2 shadow"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Logo */}

          <div className="text-center mb-8">

            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl">

              <Building2 size={38} />

            </div>

            <h1 className="mt-5 text-3xl font-bold dark:text-white">
              Forgot Password
            </h1>

            <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm leading-6">
              Password reset is performed through your registered email.
              Your account must be approved by the Society Administrator.
            </p>

          </div>
                    {submitted ? (

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >

              <CheckCircle2
                className="mx-auto text-green-500 mb-5"
                size={70}
              />

              <h2 className="text-2xl font-bold dark:text-white">
                Request Submitted
              </h2>

              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-7">

                If an account exists with this email and it has been
                approved by the Society Administrator,
                password reset instructions will be sent to the
                registered email address.

              </p>

              <div className="mt-6 rounded-xl bg-blue-50 dark:bg-blue-900/30 p-4 border border-blue-200 dark:border-blue-800">

                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold">

                  <ShieldCheck size={18} />

                  Security Information

                </div>

                <ul className="mt-3 text-sm text-left text-gray-600 dark:text-gray-300 space-y-2">

                  <li>• Only admin-approved accounts can reset passwords.</li>

                  <li>• Password reset links are sent only to the registered email.</li>

                  <li>• Contact your Society Administrator if your account is pending approval.</li>

                </ul>

              </div>

              <Link
                to="/"
                className="mt-8 inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
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

                <label className="block mb-2 font-semibold dark:text-white">
                  Registered Email Address
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
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />

                </div>

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Enter the email registered with your society account.
                </p>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 py-3 text-white font-semibold hover:scale-[1.02] transition disabled:opacity-60"
              >

                {loading ? (

                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                ) : (

                  <Send size={18} />

                )}

                {loading
                  ? "Submitting..."
                  : "Send Reset Instructions"}

              </button>

              <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 p-4">

                <h3 className="font-semibold text-yellow-700 dark:text-yellow-300">
                  Important
                </h3>

                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-2">

                  <li>• SMS OTP is not used.</li>
                  <li>• No paid OTP provider is required.</li>
                  <li>• Password recovery uses your registered email.</li>
                  <li>• Account approval by Admin is mandatory.</li>

                </ul>

              </div>

              <Link
                to="/"
                className="flex justify-center items-center gap-2 text-blue-600 hover:underline font-medium"
              >
                <ArrowLeft size={18} />
                Back to Login
              </Link>

            </form>

          )}

          <div className="mt-8 border-t pt-5 text-center">

            <p className="text-xs text-gray-500">
              Diamond Square Society Management System
            </p>

            <p className="text-xs font-semibold text-blue-600 mt-1">
              Version 2.0
            </p>

          </div>

        </div>

      </motion.div>

    </div>
  );
}

export default ForgotPassword;