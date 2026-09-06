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