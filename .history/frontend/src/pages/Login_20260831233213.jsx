import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Lock,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Home,
  LogIn,
  Moon,
  Sun,
  Building2,
  RefreshCcw,
  Sparkles,
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

  const [failedAttempts, setFailedAttempts] = useState(0);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const rememberedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const announcement = rememberedUser?.name
    ? `Welcome back, ${rememberedUser.name}! 👋`
    : "Welcome to Diamond Square 👋";

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

    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
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
    const randomValues = new Uint32Array(6);
    crypto.getRandomValues(randomValues);

    let code = "";

    for (const value of randomValues) {
      code += chars.charAt(value % chars.length);
    }

    setCaptcha(code);
  };

  const validate = (name, value) => {
    let message = "";

    if (name === "login") {
      const email = /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/;
      const mobile = /^[6-9]\d{9}$/;

      if (!email.test(value) && !mobile.test(value)) {
        message = "Enter a valid Email or Mobile Number.";
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        message = "Password must contain at least 6 characters.";
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
    if (/\d/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password)) score++;

    if (score <= 1) {
      return {
        text: "Weak",
        color: "bg-red-500 w-1/3",
      };
    }

    if (score <= 3) {
      return {
        text: "Medium",
        color: "bg-yellow-500 w-2/3",
      };
    }

    return {
      text: "Strong",
      color: "bg-green-500 w-full",
    };
  }, [form.password]);

  const isFormValid = useMemo(() => {
    return (
      form.login &&
      form.password &&
      !errors.login &&
      !errors.password &&
      captchaInput.toUpperCase() === captcha
    );
  }, [form, errors, captchaInput, captcha]);

  const loginIcon = useMemo(() => {
    if (form.login.includes("@")) {
      return (
        <Mail
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
      );
    }

    if (/^[6-9]\d*$/.test(form.login)) {
      return (
        <Phone
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
      );
    }

    return (
      <Home
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
    );
  }, [form.login]);
    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOnline) {
      toast.error(
        "No Internet Connection. Please check your connection."
      );
      return;
    }

    if (captchaInput.toUpperCase() !== captcha) {
      toast.error("Invalid CAPTCHA");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        login: form.login.trim(),
        password: form.password,
      });

      const { token, user } = res.data;

      if (user.approval_status !== "approved") {
        toast.warning(
          "Your account is awaiting Admin approval."
        );
        return;
      }

      if (!user.otp_verified) {
        toast.info(
          "An OTP has been sent to your registered email."
        );

        navigate("/verify-otp", {
          state: { phone: user.phone },
        });

        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
      localStorage.setItem("role", user.role);
      localStorage.setItem(
        "last_login",
        new Date().toISOString()
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
        `Welcome back, ${user.name}!`
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 900);
    } catch (error) {
      setFailedAttempts((prev) => prev + 1);

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

  const currentHour = new Date().getHours();

  let greeting;

  if (currentHour < 12) {
    greeting = "Good Morning ☀️";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon 🌤️";
  } else {
    greeting = "Good Evening 🌙";
  }

  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    }
  );

  const passwordBarClass = `${passwordStrength.color} h-2 rounded-full transition-all duration-500`;

  const cardAnimation = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-200 dark:from-slate-950 dark:via-gray-900 dark:to-black flex items-center justify-center px-4 py-8">

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
          className="absolute w-80 h-80 rounded-full bg-blue-500/20 blur-3xl -top-10 -left-16"
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
          className="absolute w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl bottom-0 right-0"
        />

      </div>

      <motion.div
        variants={cardAnimation}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/30 bg-white/85 dark:bg-gray-900/90 backdrop-blur-2xl shadow-2xl p-8"></div>