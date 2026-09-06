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
    document.documentElement.classList.toggle("dark", darkMode);

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    const values = new Uint32Array(6);
    crypto.getRandomValues(values);

    let code = "";

    values.forEach((value) => {
      code += chars[value % chars.length];
    });

    setCaptcha(code);
  };

  const validate = (name, value) => {
    let message = "";

    if (name === "login") {
      const input = value.trim();

      const email =
        /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/i;

      const mobile =
        /^[6-9]\d{9}$/;

      if (
        input &&
        !email.test(input) &&
        !mobile.test(input)
      ) {
        message =
          "Enter a valid Email or Mobile Number.";
      }
    }

    if (name === "password") {
      if (value && value.length < 8) {
        message =
          "Password must contain at least 8 characters.";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    validate(name, value);
  };

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (form.password.length >= 8) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/[a-z]/.test(form.password)) score++;
    if (/\d/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password))
      score++;

    if (score <= 2)
      return {
        text: "Weak",
        color: "bg-red-500 w-1/3",
      };

    if (score <= 4)
      return {
        text: "Medium",
        color: "bg-yellow-500 w-2/3",
      };

    return {
      text: "Strong",
      color: "bg-green-500 w-full",
    };
  }, [form.password]);

  const isFormValid = useMemo(() => {
    return (
      form.login.trim() &&
      form.password &&
      !errors.login &&
      !errors.password &&
      captchaInput.trim().toUpperCase() === captcha
    );
  }, [
    form,
    errors,
    captchaInput,
    captcha,
  ]);

  const loginIcon = useMemo(() => {
    const value = form.login.trim();

    if (value.includes("@")) {
      return (
        <Mail
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
      );
    }

    if (/^[6-9]\d*$/.test(value)) {
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

  if (loading) return;

  if (!isOnline) {
    toast.error(
      "No Internet Connection. Please check your connection."
    );
    return;
  }

  const login = form.login.trim();
  const password = form.password;

  validate("login", login);
  validate("password", password);

  if (!login || !password) {
    toast.warning("Please fill all required fields.");
    return;
  }

  if (
    captchaInput.trim().toUpperCase() !==
    captcha
  ) {
    toast.error("Invalid CAPTCHA");
    generateCaptcha();
    setCaptchaInput("");
    return;
  }

  try {
    setLoading(true);

    const { data } = await api.post(
      "/auth/login",
      {
        login,
        password,
      }
    );

    const { token, user } = data;

    if (!user) {
      throw new Error("User data not received.");
    }

    // Pending Approval
    if (
      user.approval_status &&
      user.approval_status !== "approved"
    ) {
      toast.warning(
        "Your account is awaiting Admin approval."
      );
      return;
    }

    // Email OTP Verification
    if (
      user.otp_verified === false
    ) {
      toast.info(
        "Please verify the OTP sent to your registered email."
      );

      navigate("/verify-otp", {
        state: {
          email: user.email,
          phone: user.phone,
        },
      });

      return;
    }

    // Save Login Session
    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    localStorage.setItem(
      "role",
      user.role || "resident"
    );

    localStorage.setItem(
      "last_login",
      new Date().toISOString()
    );

    if (remember) {
      localStorage.setItem(
        "remember_login",
        login
      );
    } else {
      localStorage.removeItem(
        "remember_login"
      );
    }

    toast.success(
      `Welcome back, ${user.name}!`
    );

    // Small delay for smooth UX
    setTimeout(() => {
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;

        case "guard":
          navigate("/guard/dashboard");
          break;

        default:
          navigate("/dashboard");
      }
    }, 800);
  } catch (error) {
    setFailedAttempts(
      (prev) => prev + 1
    );

    generateCaptcha();
    setCaptchaInput("");

    const message =
      error.response?.data?.message ||
      error.message ||
      "Login failed. Please try again.";

    toast.error(message);
  } finally {
    setLoading(false);
  }
};
{/* ===================== LOGIN ===================== */}

<div>

  <label
    htmlFor="login"
    className="mb-2 block text-sm font-semibold dark:text-gray-200"
  >
    Email or Mobile Number
  </label>

  <div className="relative">

    {loginIcon}

    <input
      id="login"
      name="login"
      type="text"
      autoFocus
      autoComplete="username"
      spellCheck={false}
      value={form.login}
      onChange={handleChange}
      placeholder="Enter Email or Mobile Number"
      aria-label="Email or Mobile Number"
      aria-invalid={!!errors.login}
      className={`w-full rounded-xl py-3 pl-12 pr-4
      bg-white dark:bg-gray-800 dark:text-white
      outline-none transition-all duration-300
      ${
        errors.login
          ? "border border-red-500 focus:ring-2 focus:ring-red-500"
          : "border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
      }`}
    />

  </div>

  {errors.login && (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-2 text-xs text-red-500"
    >
      {errors.login}
    </motion.p>
  )}

</div>

{/* ===================== PASSWORD ===================== */}

<div>

  <label
    htmlFor="password"
    className="mb-2 block text-sm font-semibold dark:text-gray-200"
  >
    Password
  </label>

  <div className="relative">

    <Lock
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      id="password"
      name="password"
      autoComplete="current-password"
      spellCheck={false}
      value={form.password}
      onChange={handleChange}
      placeholder="Enter Password"
      aria-label="Password"
      aria-invalid={!!errors.password}
      type={showPassword ? "text" : "password"}
      className={`w-full rounded-xl py-3 pl-12 pr-12
      bg-white dark:bg-gray-800 dark:text-white
      outline-none transition-all duration-300
      ${
        errors.password
          ? "border border-red-500 focus:ring-2 focus:ring-red-500"
          : "border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
      }`}
    />

    <button
      type="button"
      aria-label={
        showPassword
          ? "Hide Password"
          : "Show Password"
      }
      onClick={() =>
        setShowPassword(!showPassword)
      }
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
    >
      {showPassword ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}
    </button>

  </div>

  {errors.password && (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-2 text-xs text-red-500"
    >
      {errors.password}
    </motion.p>
  )}

  <div className="mt-3">

    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">

      <motion.div
        layout
        transition={{ duration: 0.3 }}
        className={passwordBarClass}
      />

    </div>

    <div className="mt-2 flex items-center justify-between">

      <span className="text-xs text-gray-500">
        Password Strength
      </span>

      <span
        className={`text-xs font-semibold
        ${
          passwordStrength.text === "Strong"
            ? "text-green-600"
            : passwordStrength.text === "Medium"
            ? "text-yellow-600"
            : "text-red-500"
        }`}
      >
        {passwordStrength.text}
      </span>

    </div>

  </div>

</div>

{/* ===================== CAPTCHA ===================== */}

<div>

  <label
    htmlFor="captcha"
    className="mb-2 block text-sm font-semibold dark:text-gray-200"
  >
    CAPTCHA Verification
  </label>

  <div className="mb-3 flex items-center justify-between rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3">

    <span className="select-none font-mono text-xl font-bold tracking-[0.35em]">
      {captcha}
    </span>

    <button
      type="button"
      onClick={() => {
        generateCaptcha();
        setCaptchaInput("");
      }}
      className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-blue-600 transition hover:bg-blue-50 dark:hover:bg-gray-700"
    >
      <RefreshCcw
        size={16}
        className="transition-transform hover:rotate-180"
      />
      Refresh
    </button>

  </div>

  <input
    id="captcha"
    value={captchaInput}
    maxLength={6}
    autoComplete="off"
    spellCheck={false}
    onChange={(e) =>
      setCaptchaInput(
        e.target.value.toUpperCase()
      )
    }
    placeholder="Enter CAPTCHA"
    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500"
  />

  <p className="mt-2 text-xs text-gray-500">
    CAPTCHA is case-insensitive.
  </p>

</div>
{/* ===================== REMEMBER ===================== */}

<div className="flex items-center justify-between">

  <label className="flex items-center gap-2 text-sm dark:text-gray-300 cursor-pointer">

    <input
      type="checkbox"
      checked={remember}
      onChange={(e) => setRemember(e.target.checked)}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />

    <span>Remember Me</span>

  </label>

  <Link
    to="/forgot-password"
    className="text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
  >
    Forgot Password?
  </Link>

</div>

{/* ===================== LOGIN BUTTON ===================== */}

<button
  type="submit"
  disabled={loading || !isFormValid || !isOnline}
  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? (
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
  ) : (
    <LogIn
      size={20}
      className="transition-transform duration-300 group-hover:translate-x-1"
    />
  )}

  {loading ? "Signing In..." : "Login"}
</button>

{/* ===================== FAILED LOGIN ===================== */}

{failedAttempts >= 3 && (

  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-red-300 bg-red-50 p-4 text-center dark:border-red-700 dark:bg-red-900/20"
  >

    <p className="font-semibold text-red-600 dark:text-red-300">
      Multiple failed login attempts detected
    </p>

    <p className="mt-1 text-xs text-red-500">
      Please verify your Email/Mobile and Password before trying again.
    </p>

  </motion.div>

)}

</form>

{/* ===================== REGISTER CARD ===================== */}

<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.25 }}
  className="mt-7 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 text-center shadow-sm dark:border-blue-800 dark:from-slate-900 dark:to-slate-800"
>

  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
    New to Diamond Square?
  </h3>

  <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
    Register your flat to access notices, maintenance,
    visitor management, complaints, events and all
    society services.
  </p>

  <p className="mt-2 text-xs font-medium text-blue-600">
    ✔ Admin Approval Required
  </p>

  <Link
    to="/register"
    className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
  >
    Create Account
  </Link>

</motion.div>

{/* ===================== FOOTER ===================== */}

<div className="mt-8 border-t border-gray-200 pt-5 text-center dark:border-gray-700">

  <h4 className="font-semibold text-gray-700 dark:text-gray-300">
    Diamond Square Society
  </h4>

  <p className="mt-1 text-xs text-blue-600">
    Smart Society Management Platform
  </p>

  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">

    <span>Version 2.0</span>

    <span>•</span>

    <span>Secure Login</span>

    <span>•</span>

    <span>Made with ❤️</span>

  </div>

  <p className="mt-3 text-xs text-gray-400">
    © 2026 Diamond Square. All Rights Reserved.
  </p>

</div>
<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-200 dark:from-slate-950 dark:via-slate-900 dark:to-black flex items-center justify-center px-4 py-8">

  {/* ================= BACKGROUND ================= */}

  <div className="absolute inset-0 overflow-hidden">

    {/* Blue Orb */}

    <motion.div
      animate={{
        x: [0, 120, 0],
        y: [0, -80, 0],
        scale: [1, 1.12, 1],
      }}
      transition={{
        duration: 16,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
    />

    {/* Indigo Orb */}

    <motion.div
      animate={{
        x: [0, -120, 0],
        y: [0, 90, 0],
        scale: [1.08, 1, 1.08],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute -bottom-24 -right-24 h-[30rem] w-[30rem] rounded-full bg-indigo-500/20 blur-3xl"
    />

    {/* Floating Circle */}

    <motion.div
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 80,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
    />

    {/* Small Glow */}

    <motion.div
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
      }}
      className="absolute right-20 top-20 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl"
    />

    {/* Radial Overlay */}

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.18),transparent_70%)]" />

  </div>

  {/* ================= MAIN CARD ================= */}

  <motion.div
    variants={cardAnimation}
    initial="hidden"
    animate="visible"
    className="relative z-10 w-full max-w-md"
  >

    <div className="relative rounded-[30px] border border-white/30 bg-white/90 p-8 shadow-[0_25px_60px_rgba(0,0,0,.18)] backdrop-blur-3xl dark:border-slate-700 dark:bg-slate-900/90">

      {/* ================= THEME TOGGLE ================= */}

      <button
        type="button"
        aria-label="Toggle Theme"
        onClick={() => setDarkMode(!darkMode)}
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition-all duration-500 hover:rotate-180 hover:scale-110 dark:bg-slate-800 dark:text-white"
      >
        {darkMode ? (
          <Sun size={18} />
        ) : (
          <Moon size={18} />
        )}
      </button>

      {/* ================= HEADER STARTS BELOW ================= */}
      