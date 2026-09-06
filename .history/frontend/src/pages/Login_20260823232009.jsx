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
    return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-200 via-indigo-200 to-blue-300 dark:from-slate-950 dark:via-gray-900 dark:to-black flex items-center justify-center px-5">

      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white shadow-xl"
          >
            <WifiOff size={18} />
            No Internet Connection
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-10 -left-16 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
        />

        <motion.div
          animate={{ x: [0, -70, 0], y: [0, 60, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25, scale: .96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: .45 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/30 bg-white/85 p-8 shadow-2xl backdrop-blur-2xl dark:bg-gray-900/85">

          <div className="mb-6 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/40">
            <Bell size={18} />
            <div>
              <p className="text-sm font-semibold">{announcement}</p>
              <p className="text-xs opacity-70">{greeting}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="absolute right-5 top-5 rounded-full bg-white p-2 shadow dark:bg-gray-800"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
              <Building2 size={38} />
            </div>

            <h1 className="text-3xl font-bold dark:text-white">
              Diamond Square
            </h1>

            <p className="mt-2 text-gray-500">
              Secure Resident Login Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

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
                  placeholder="Email, Mobile or Flat No."
                  autoFocus
                  className="w-full rounded-xl border py-3 pl-12 pr-4 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {errors.login && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.login}
                </p>
              )}
            </div>

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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={handleCapsLock}
                  onKeyUp={handleCapsLock}
                  placeholder="Password"
                  className="w-full rounded-xl border py-3 pl-12 pr-12 dark:bg-gray-800 dark:text-white"
                />

                <button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {capsLock && (
                <p className="mt-1 text-xs text-amber-600">
                  Caps Lock is ON
                </p>
              )}

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className={passwordBarClass}
                  style={{ width: passwordStrength.width }}
                />
              </div>

              <p className="mt-2 text-xs">
                Password Strength :
                <span className="ml-2 font-semibold">
                  {passwordStrength.text}
                </span>
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                CAPTCHA
              </label>

              <div className="mb-2 flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3 font-mono text-xl tracking-[0.3em] dark:bg-gray-800">
                <span>{captcha}</span>

                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="flex items-center gap-1 text-sm text-blue-600"
                >
                  <RefreshCcw size={16} />
                  Refresh
                </button>
              </div>

              <input
                value={captchaInput}
                onChange={(e) =>
                  setCaptchaInput(e.target.value)
                }
                placeholder="Enter CAPTCHA"
                className="w-full rounded-xl border px-4 py-3 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) =>
                    setRemember(e.target.checked)
                  }
                />
                Remember Me
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <LogIn size={20} />
              )}

              {loading ? "Signing In..." : "Login"}
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border py-3"
              onClick={() =>
                toast.info("Coming Soon")
              }
            >
              <ShieldCheck size={18} />
              Continue with Google
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border py-3"
              onClick={() =>
                toast.info("Coming Soon")
              }
            >
              <Smartphone size={18} />
              Biometric Login
            </button>

          </form>

          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Create Resident Account
            </Link>

            <p className="mt-4 text-sm text-gray-500">
              ✔ Email Verification Required
            </p>

            <p className="text-sm text-gray-500">
              ✔ Account Approval Required
            </p>
          </div>

          <div className="mt-6">
            <a
              href="tel:+919300964577"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 py-3 text-blue-700 transition hover:bg-blue-50"
            >
              <Headphones size={18} />
              Contact Admin (+91 93009 64577)
            </a>

            <p className="mt-2 text-center text-sm text-gray-500">
              Email : iphindore@gmail.com
            </p>
          </div>

          <div className="mt-8 border-t pt-4 text-center">
            <p className="text-xs text-gray-500">
              Diamond Square Society Management System
            </p>

            <div className="mt-2 flex items-center justify-center gap-2">
              <CheckCircle2
                size={14}
                className="text-green-600"
              />
              <span className="text-xs font-semibold text-blue-600">
                Version 2.1
              </span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default Login;