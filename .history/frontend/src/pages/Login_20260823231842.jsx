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
  Home,
  LogIn,
  ShieldCheck,
  Smartphone,
  Headphones,
  RefreshCcw,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const [capsLock, setCapsLock] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [greeting, setGreeting] = useState("");

  const announcement =
    "📢 Welcome to Diamond Square Society Management System v2.1";

  useEffect(() => {
    const remembered =
      localStorage.getItem("remember_login");

    if (remembered) {
      setForm((prev) => ({
        ...prev,
        login: remembered,
      }));
      setRemember(true);
    }

    const theme =
      localStorage.getItem("theme");

    if (theme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add(
        "dark"
      );
    } else if (!theme) {
      const prefersDark =
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

      if (prefersDark) {
        setDarkMode(true);
        document.documentElement.classList.add(
          "dark"
        );
      }
    }

    const hour = new Date().getHours();

    if (hour < 12) setGreeting("Good Morning ☀️");
    else if (hour < 17)
      setGreeting("Good Afternoon 🌤");
    else
      setGreeting("Good Evening 🌙");

    generateCaptcha();

    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener(
        "online",
        online
      );
      window.removeEventListener(
        "offline",
        offline
      );
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(
        "dark"
      );
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove(
        "dark"
      );
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {
      code += chars.charAt(
        Math.floor(
          Math.random() * chars.length
        )
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

      const flat =
        /^[A-Za-z0-9-]{2,10}$/;

      if (
        !email.test(value) &&
        !mobile.test(value) &&
        !flat.test(value)
      ) {
        message =
          "Enter Email, Mobile Number or Flat Number.";
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
    if (/[A-Z]/.test(form.password))
      score++;
    if (/[0-9]/.test(form.password))
      score++;
    if (
      /[^A-Za-z0-9]/.test(form.password)
    )
      score++;

    if (score <= 1)
      return {
        text: "Weak",
        color: "bg-red-500",
        width: "25%",
      };

    if (score <= 3)
      return {
        text: "Medium",
        color: "bg-yellow-500",
        width: "65%",
      };

    return {
      text: "Strong",
      color: "bg-green-500",
      width: "100%",
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
  }, [
    form,
    errors,
    captcha,
    captchaInput,
  ]);
    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOnline) {
      toast.error(
        "No Internet Connection. Please try again."
      );
      return;
    }

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
        {
          login: form.login,
          password: form.password,
        }
      );

      const user = res.data.user;

      if (!user.is_verified) {
        toast.error(
          "Please verify your email before logging in."
        );
        return;
      }

      if (!user.is_approved) {
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
        JSON.stringify(user)
      );

      localStorage.setItem(
        "role",
        user.role
      );

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

  const loginIcon = useMemo(() => {
    if (form.login.includes("@"))
      return (
        <Mail
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
      );

    if (/^[6-9]\d*$/.test(form.login))
      return (
        <Phone
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
      );

    return (
      <Home
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
    );
  }, [form.login]);

  const passwordBarClass = `${passwordStrength.color} h-2 rounded-full transition-all duration-500`;

  const handleCapsLock = (e) => {
    setCapsLock(
      e.getModifierState("CapsLock")
    );
  };
  