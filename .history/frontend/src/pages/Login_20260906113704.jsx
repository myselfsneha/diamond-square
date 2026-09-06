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
  LogIn,
  Headphones,
  Info,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [errors, setErrors] = useState({
    phone: "",
    password: "",
  });

  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const announcement =
    "📢 Welcome to Diamond Square Secure Society Management Portal";

  useEffect(() => {
    const savedPhone = localStorage.getItem("remember_phone");

    if (savedPhone) {
      setForm((prev) => ({
        ...prev,
        phone: savedPhone,
      }));
      setRemember(true);
    }

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
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
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

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

    if (name === "phone") {
      if (!/^[6-9]\d{9}$/.test(value)) {
        message = "Enter a valid 10-digit mobile number.";
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        message = "Minimum 6 characters required.";
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

  const isFormValid = useMemo(() => {
    return (
      form.phone &&
      form.password &&
      !errors.phone &&
      !errors.password &&
      captchaInput.toUpperCase() === captcha
    );
  }, [form, errors, captchaInput, captcha]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (captchaInput.toUpperCase() !== captcha) {
      toast.error("Invalid CAPTCHA");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );
      localStorage.setItem("role", res.data.user.role);

      if (remember) {
        localStorage.setItem(
          "remember_phone",
          form.phone
        );
      } else {
        localStorage.removeItem("remember_phone");
      }

      toast.success("Welcome Back!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );

      if (
        error.response?.status === 403 &&
        error.response?.data?.message ===
          "OTP sent to your email."
      ) {
        toast.info(
          "Verification OTP has been sent to your email."
        );

        navigate("/verify-otp", {
          state: {
            phone: form.phone,
          },
        });

        return;
      }

      generateCaptcha();
      setCaptchaInput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-200 via-indigo-200 to-blue-300 dark:from-slate-950 dark:via-gray-900 dark:to-black flex items-center justify-center px-5">

      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 14,
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
          scale: 0.95,
          y: 25,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="relative w-full max-w-md"
      >

        <div className="backdrop-blur-2xl bg-white/85 dark:bg-gray-900/85 border border-white/30 rounded-3xl shadow-2xl p-8">

          <div className="flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 px-4 py-3 mb-6">
            <Bell size={18} className="text-blue-600" />
            <p className="text-sm font-medium text-blue-700 dark:text-blue-200">
              {announcement}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white dark:bg-gray-800 shadow"
          >
            {darkMode ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <div className="text-center mb-8">

            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
              <Building2 size={38} />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Diamond Square
            </h1>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Secure Society Management Portal
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">