import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import {
  Building2,
  Mail,
  Phone,
  Home,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Sun,
  Moon,
  LogIn,
  ShieldCheck,
  Smartphone,
  Headphones,
  RefreshCcw,
  Wifi,
  WifiOff,
  Download,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const deferredPrompt = useRef(null);

  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  const [isOnline, setIsOnline] = useState(
    navigator.onLine
  );

  const [serverOnline, setServerOnline] =
    useState(true);

  const [capsLock, setCapsLock] =
    useState(false);

  const [failedAttempts, setFailedAttempts] =
    useState(0);

  const [captcha, setCaptcha] =
    useState("");

  const [captchaInput, setCaptchaInput] =
    useState("");

  const [installAvailable, setInstallAvailable] =
    useState(false);

  const [updateAvailable, setUpdateAvailable] =
    useState(false);

  const [showAnnouncement, setShowAnnouncement] =
    useState(true);

  const [lastLogin, setLastLogin] =
    useState("");

  const [errors, setErrors] = useState({
    login: "",
    password: "",
  });

  const announcement =
    "🏡 Welcome to Diamond Square Society Management System";

  useEffect(() => {
    const remembered =
      localStorage.getItem(
        "remember_login"
      );

    if (remembered) {
      setRemember(true);
      setForm((prev) => ({
        ...prev,
        login: remembered,
      }));
    }

    const theme =
      localStorage.getItem("theme");

    if (
      theme === "dark" ||
      (!theme &&
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches)
    ) {
      setDarkMode(true);
      document.documentElement.classList.add(
        "dark"
      );
    }

    const loginTime =
      localStorage.getItem("last_login");

    if (loginTime) {
      setLastLogin(loginTime);
    }

    generateCaptcha();

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    checkServerStatus();

    return () => {
      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );

      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(
        "dark"
      );
      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );
      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [darkMode]);

  const handleOnline = () => {
    setIsOnline(true);
    toast.success("Internet Connected");
    checkServerStatus();
  };

  const handleOffline = () => {
    setIsOnline(false);
    toast.error("No Internet Connection");
  };

  const handleBeforeInstallPrompt = (e) => {
    e.preventDefault();
    deferredPrompt.current = e;
    setInstallAvailable(true);
  };

  const installApp = async () => {
    if (!deferredPrompt.current) return;

    deferredPrompt.current.prompt();

    await deferredPrompt.current.userChoice;

    deferredPrompt.current = null;

    setInstallAvailable(false);
  };

  const checkServerStatus = async () => {
    try {
      await api.get("/health");
      setServerOnline(true);
    } catch {
      setServerOnline(false);
    }
  };

  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {
      code += chars.charAt(
        Math.floor(
          Math.random() *
            chars.length
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

      const phone =
        /^[6-9]\d{9}$/;

      const flat =
        /^[A-Za-z]-?\d{2,4}$/;

      if (
        !email.test(value) &&
        !phone.test(value) &&
        !flat.test(value)
      ) {
        message =
          "Enter Email, Mobile or Flat Number.";
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
    const { name, value } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    validate(name, value);
  };

  const passwordStrength =
    useMemo(() => {
      let score = 0;

      if (
        form.password.length >= 8
      )
        score++;

      if (
        /[A-Z]/.test(
          form.password
        )
      )
        score++;

      if (
        /[0-9]/.test(
          form.password
        )
      )
        score++;

      if (
        /[^A-Za-z0-9]/.test(
          form.password
        )
      )
        score++;

      if (score <= 1)
        return {
          label: "Weak",
          width: "25%",
          color: "bg-red-500",
        };

      if (score <= 3)
        return {
          label: "Medium",
          width: "65%",
          color:
            "bg-yellow-500",
        };

      return {
        label: "Strong",
        width: "100%",
        color:
          "bg-green-600",
      };
    }, [form.password]);

  const loginIcon =
    useMemo(() => {
      if (
        form.login.includes("@")
      )
        return (
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        );

      if (
        /^[6-9]\d*$/.test(
          form.login
        )
      )
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

  const isFormValid =
    useMemo(() => {
      return (
        form.login &&
        form.password &&
        !errors.login &&
        !errors.password &&
        captchaInput.toUpperCase() ===
          captcha
      );
    }, [
      form,
      errors,
      captcha,
      captchaInput,
    ]);

  const handleCapsLock = (e) => {
    setCapsLock(
      e.getModifierState(
        "CapsLock"
      )
    );
  };
    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOnline) {
      toast.error(
        "No Internet Connection. Please try again."
      );
      return;
    }

    if (!serverOnline) {
      toast.error(
        "Server is temporarily unavailable."
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
          login: form.login.trim(),
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

      setFailedAttempts(0);

      toast.success(
        `Welcome back, ${user.name}!`
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 900);
    } catch (error) {
      setFailedAttempts(
        (prev) => prev + 1
      );

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

  const installPWA = async () => {
    if (!deferredPrompt.current) {
      toast.info(
        "App installation isn't available right now."
      );
      return;
    }

    deferredPrompt.current.prompt();

    const choice =
      await deferredPrompt.current.userChoice;

    if (
      choice.outcome === "accepted"
    ) {
      toast.success(
        "Thanks for installing the app!"
      );
    }

    deferredPrompt.current = null;
    setInstallAvailable(false);
  };

  const formattedLastLogin =
    useMemo(() => {
      if (!lastLogin) return null;

      try {
        return new Date(
          lastLogin
        ).toLocaleString();
      } catch {
        return lastLogin;
      }
    }, [lastLogin]);

  const passwordBarClass = `${passwordStrength.color} h-2 rounded-full transition-all duration-500`;

  const pageVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.98,
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

  const floatingAnimation = {
    animate: {
      y: [0, -18, 0],
      x: [0, 10, 0],
    },
    transition: {
      repeat: Infinity,
      duration: 10,
      ease: "easeInOut",
    },
  };

  const statusColor = serverOnline
    ? "text-green-600"
    : "text-red-600";

  const statusIcon = serverOnline ? (
    <CheckCircle2 size={16} />
  ) : (
    <AlertTriangle size={16} />
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 dark:from-slate-950 dark:via-slate-900 dark:to-black"></div>