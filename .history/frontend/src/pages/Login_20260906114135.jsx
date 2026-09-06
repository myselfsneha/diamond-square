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
  X,
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
  const [showAbout, setShowAbout] = useState(false);

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

            <div>

              <label className="mb-2 block text-sm font-semibold">
                Mobile Number
              </label>

              <div className="relative">

                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

              </div>

              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phone}
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
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-12 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password}
                </p>
              )}

            </div>
                        <div>

              <label className="mb-2 block text-sm font-semibold">
                CAPTCHA
              </label>

              <div className="mb-2 flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3 font-mono text-xl tracking-[0.3em] dark:bg-gray-800">
                {captcha}

                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-xs text-blue-600"
                >
                  Refresh
                </button>

              </div>

              <input
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter CAPTCHA"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                className="text-blue-600 hover:underline text-sm font-medium"
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

          </form>

          <div className="mt-6 text-center">

            <p className="text-sm text-gray-500 dark:text-gray-400">
              New to Diamond Square?
            </p>

            <Link
              to="/register"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition"
            >
              Create an Account
            </Link>

          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={() => setShowAbout(true)}
              className="flex items-center justify-center gap-2 rounded-xl border py-3 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <Info size={18} />
              About
            </button>

            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 py-3 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/30 transition"
            >
              <Headphones size={18} />
              Need Help?
            </button>

          </div>

          <div className="mt-8 border-t pt-5 text-center">

            <p className="text-xs text-gray-500">
              © 2026 Diamond Square Society
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Secure • Smart • Connected
            </p>

            <p className="mt-2 text-xs font-semibold text-blue-600">
              Developed by Sneha & Nikita
            </p>

          </div>

        </div>

        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-2xl">

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Need Help?
                </h2>

                <button onClick={() => setShowHelp(false)}>
                  <X />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-sm">

                <div className="flex gap-3">
                  <Headphones className="text-blue-600" />
                  <div>
                    <p className="font-semibold">Admin Contact</p>
                    <p>+91 93009 64577</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="text-blue-600" />
                  <div>
                    <p className="font-semibold">Support Email</p>
                    <p>iphindore@gmail.com</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {showAbout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-2xl">

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  About Diamond Square
                </h2>

                <button onClick={() => setShowAbout(false)}>
                  <X />
                </button>
              </div>

              <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-300">

                <p>
                  Diamond Square is a secure society management portal
                  designed for residents and administrators.
                </p>

                <p>
                  Residents register using their mobile number and
                  receive an email OTP for verification.
                </p>

                <p>
                  Every new account requires one-time approval from
                  the society administrator.
                </p>

                <p>
                  Once approved, future logins are instant and do not
                  require admin approval again.
                </p>

                <p>
                  Forgot Password works using email verification,
                  allowing password reset without SMS.
                </p>

                <div className="border-t pt-4 text-center">

                  <p className="font-semibold text-blue-600">
                    Secure • Smart • Connected
                  </p>

                  <p className="mt-2">
                    Developed by Sneha & Nikita
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    © 2026 Diamond Square Society
                  </p>

                </div>

              </div>
            </div>
          </div>
        )}

      </motion.div>

    </div>
  );
}

export default Login;