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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 dark:from-slate-950 dark:via-slate-900 dark:to-black">
            {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          {...floatingAnimation}
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 14,
          }}
          className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
        />
      </div>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8"
      >
        <div className="w-full max-w-md">

          {/* Install Banner */}
          <AnimatePresence>
            {installAvailable && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="mb-4 flex items-center justify-between rounded-2xl bg-blue-600 p-4 text-white shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Download size={18} />
                  <span className="text-sm font-medium">
                    Install App
                  </span>
                </div>

                <button
                  onClick={installPWA}
                  className="rounded-lg bg-white/20 px-3 py-1 text-sm"
                >
                  Install
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Update Banner */}
          {updateAvailable && (
            <div className="mb-4 rounded-xl bg-yellow-100 p-3 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
              A new version is available. Refresh to update.
            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl backdrop-blur-2xl dark:border-gray-700 dark:bg-gray-900/80">

            {/* Theme */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="absolute right-6 top-6 rounded-full bg-white p-2 shadow-lg dark:bg-gray-800"
            >
              {darkMode ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            {/* Announcement */}
            {showAnnouncement && (
              <div className="mb-6 flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
                <Bell size={18} />
                <p className="flex-1 text-sm font-medium">
                  {announcement}
                </p>

                <button
                  onClick={() =>
                    setShowAnnouncement(false)
                  }
                  className="text-xs opacity-70 hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Logo */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
                <Building2 size={38} />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Diamond Square
              </h1>

              <p className="mt-2 text-gray-500">
                Welcome back 👋
              </p>
            </div>

            {/* Status */}
            <div className="mb-6 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi
                    size={16}
                    className="text-green-600"
                  />
                ) : (
                  <WifiOff
                    size={16}
                    className="text-red-500"
                  />
                )}

                <span className="text-sm">
                  {isOnline
                    ? "Online"
                    : "Offline"}
                </span>
              </div>

              <div
                className={`flex items-center gap-1 text-sm ${statusColor}`}
              >
                {statusIcon}
                Server
              </div>
            </div>

            {formattedLastLogin && (
              <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm dark:bg-green-900/20">
                <Clock3 size={16} />
                Last Login: {formattedLastLogin}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Login */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email / Mobile / Flat Number
                </label>

                <div className="relative">
                  {loginIcon}

                  <input
                    type="text"
                    name="login"
                    value={form.login}
                    onChange={handleChange}
                    placeholder="Enter Email, Mobile or Flat"
                    autoComplete="username"
                    className="w-full rounded-2xl border border-gray-300 bg-white py-3 pl-12 pr-4 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {errors.login && (
                  <p className="mt-1 text-xs text-red-500">
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
                    onKeyUp={handleCapsLock}
                    autoComplete="current-password"
                    placeholder="Enter Password"
                    className="w-full rounded-2xl border border-gray-300 bg-white py-3 pl-12 pr-12 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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

                {capsLock && (
                  <p className="mt-2 text-xs text-orange-500">
                    Caps Lock is ON
                  </p>
                )}

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={passwordBarClass}
                    style={{
                      width:
                        passwordStrength.width,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Password Strength:
                  <span className="ml-2 font-semibold">
                    {passwordStrength.label}
                  </span>
                </p>
              </div>
              