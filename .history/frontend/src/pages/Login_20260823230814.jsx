import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Lock,
  Eye,
  EyeOff,
  Bell,
  Sun,
  Moon,
  Building2,
  Phone,
  Mail,
  LogIn,
  ShieldCheck,
  Smartphone,
  Headphones,
  RefreshCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [errors, setErrors] = useState({
    login: "",
    password: "",
  });

  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const announcement =
    "📢 Welcome to Diamond Square Society Management System v2.0";

  useEffect(() => {
    const remembered = localStorage.getItem("remember_login");

    if (remembered) {
      setForm((prev) => ({
        ...prev,
        login: remembered,
      }));
      setRemember(true);
    }

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    generateCaptcha();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {
      code += chars.charAt(
        Math.floor(Math.random() * chars.length)
      );
    }

    setCaptcha(code);
  };

  const validate = (name, value) => {
    let message = "";

    if (name === "login") {
      const email =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const mobile =
        /^[6-9]\d{9}$/;

      if (
        !email.test(value) &&
        !mobile.test(value)
      ) {
        message =
          "Enter a valid Email or Mobile Number.";
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        message =
          "Password must contain at least 6 characters.";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    validate(name, value);
  };

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (form.password.length >= 6) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/[0-9]/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password)) score++;

    if (score <= 1) return "Weak";
    if (score === 2 || score === 3)
      return "Medium";

    return "Strong";
  }, [form.password]);

  const isFormValid = useMemo(() => {
    return (
      form.login &&
      form.password &&
      !errors.login &&
      !errors.password &&
      captchaInput.toUpperCase() === captcha
    );
  }, [
    form,
    errors,
    captchaInput,
    captcha,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      captchaInput.toUpperCase() !== captcha
    ) {
      toast.error("Invalid CAPTCHA");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/login",
        form
      );

      if (!res.data.user.is_verified) {
        toast.error(
          "Please verify your email before logging in."
        );
        return;
      }

      if (!res.data.user.is_approved) {
        toast.warning(
          "Your account is awaiting Admin approval."
        );
        return;
      }

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      localStorage.setItem(
        "role",
        res.data.user.role
      );

      if (remember) {
        localStorage.setItem(
          "remember_login",
          form.login
        );
      } else {
        localStorage.removeItem(
          "remember_login"
        );
      }

      toast.success(
        `Welcome ${res.data.user.name}`
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
          } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );

      generateCaptcha();
      setCaptchaInput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-200 via-indigo-200 to-blue-300 dark:from-slate-950 dark:via-gray-900 dark:to-black flex items-center justify-center px-5">

      {/* Animated Background */}

      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
          }}
          className="absolute w-72 h-72 rounded-full bg-blue-500/20 blur-3xl -top-10 -left-16"
        />

        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
          }}
          className="absolute w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl bottom-0 right-0"
        />

      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.45,
        }}
        className="relative w-full max-w-md"
      >

        <div className="backdrop-blur-2xl bg-white/85 dark:bg-gray-900/85 border border-white/30 rounded-3xl shadow-2xl p-8">

          {/* Announcement */}

          <div className="flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 px-4 py-3 mb-6">
            <Bell size={18} />
            <p className="text-sm font-medium">
              {announcement}
            </p>
          </div>

          {/* Theme */}

          <button
            type="button"
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="absolute top-5 right-5 p-2 rounded-full bg-white dark:bg-gray-800 shadow"
          >
            {darkMode ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          {/* Logo */}

          <div className="text-center mb-8">

            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
              <Building2 size={38} />
            </div>

            <h1 className="text-3xl font-bold dark:text-white">
              Diamond Square
            </h1>

            <p className="text-gray-500 mt-2">
              Secure Resident Login Portal
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email / Mobile */}

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Email or Mobile Number
              </label>

              <div className="relative">

                {form.login.includes("@") ? (
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                ) : (
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                )}

                <input
                  type="text"
                  name="login"
                  value={form.login}
                  onChange={handleChange}
                  placeholder="Email or Mobile"
                  className="w-full rounded-xl border py-3 pl-12 pr-4 dark:bg-gray-800 dark:text-white"
                />

              </div>

              {errors.login && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.login}
                </p>
              )}

            </div>

            {/* Password */}

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full rounded-xl border py-3 pl-12 pr-12 dark:bg-gray-800 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              <div className="mt-2 text-xs">
                Password Strength:
                <span
                  className={`ml-2 font-semibold ${
                    passwordStrength === "Strong"
                      ? "text-green-600"
                      : passwordStrength ===
                        "Medium"
                      ? "text-yellow-600"
                      : "text-red-500"
                  }`}
                >
                  {passwordStrength}
                </span>
              </div>
            </div>
            