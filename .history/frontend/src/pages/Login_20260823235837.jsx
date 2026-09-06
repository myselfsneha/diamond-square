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
  const [showPassword, setShowPassword] =
    useState(false);
  const [remember, setRemember] =
    useState(false);
  const [darkMode, setDarkMode] =
    useState(false);

  const [errors, setErrors] = useState({
    login: "",
    password: "",
  });

  const [captcha, setCaptcha] =
    useState("");
  const [captchaInput, setCaptchaInput] =
    useState("");

  const [failedAttempts, setFailedAttempts] =
    useState(0);

  const [isOnline, setIsOnline] =
    useState(navigator.onLine);

  const announcement =
    "Welcome Back 👋 Secure access for Diamond Square Residents";

  useEffect(() => {
    const remembered =
      localStorage.getItem(
        "remember_login"
      );

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
    }

    generateCaptcha();

    const online = () =>
      setIsOnline(true);

    const offline = () =>
      setIsOnline(false);

    window.addEventListener(
      "online",
      online
    );

    window.addEventListener(
      "offline",
      offline
    );

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
        form.password.length >= 6
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
          text: "Weak",
          color:
            "bg-red-500 w-1/3",
        };

      if (score <= 3)
        return {
          text: "Medium",
          color:
            "bg-yellow-500 w-2/3",
        };

      return {
        text: "Strong",
        color:
          "bg-green-500 w-full",
      };
    }, [form.password]);

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
      captchaInput,
      captcha,
    ]);

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
    