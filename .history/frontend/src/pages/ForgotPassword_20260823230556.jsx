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