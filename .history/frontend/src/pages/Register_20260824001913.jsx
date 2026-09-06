import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  Heart,
  Home,
  Briefcase,
  Building2,
  Eye,
  EyeOff,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    resident_type: "owner",
    flat_number: "",
    emergency_contact: "",
    occupation: "",
    date_of_birth: "",
    anniversary_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (form.password.length >= 8) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/[0-9]/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password)) score++;

    if (score <= 1)
      return {
        label: "Weak",
        color: "bg-red-500",
        width: "25%",
      };

    if (score === 2 || score === 3)
      return {
        label: "Medium",
        color: "bg-yellow-500",
        width: "70%",
      };

    return {
      label: "Strong",
      color: "bg-green-500",
      width: "100%",
    };
  }, [form.password]);

  const progress = useMemo(() => {
    const fields = [
      form.name,
      form.email,
      form.phone,
      form.password,
      form.flat_number,
      form.date_of_birth,
    ];

    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "flat_number"
          ? value.toUpperCase()
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      return toast.error("Phone number must be 10 digits.");
    }

    if (
      form.emergency_contact &&
      !/^[6-9]\d{9}$/.test(form.emergency_contact)
    ) {
      return toast.error(
        "Emergency contact must be 10 digits."
      );
    }

    if (form.password.length < 8) {
      return toast.error(
        "Password must contain at least 8 characters."
      );
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/register",
        form
      );

      toast.success(res.data.message);

      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            phone: form.phone,
          },
        });
      }, 1200);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-200 dark:from-slate-950 dark:via-gray-900 dark:to-black flex items-center justify-center px-5 py-8">

      {/* Background */}

      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -70, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
          }}
          className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
          }}
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
        />

      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
        className="relative w-full max-w-2xl"
      >

        <div className="rounded-3xl border border-white/30 bg-white/85 dark:bg-gray-900/90 backdrop-blur-2xl shadow-2xl p-8">

          {/* Header */}

          <div className="text-center">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
              <Building2 size={38} />
            </div>

            <h1 className="text-3xl font-bold dark:text-white">
              Diamond Square
            </h1>

            <p className="mt-2 text-gray-500">
              Create your Resident Account
            </p>

            {/* Progress */}

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs font-semibold text-gray-500">
                <span>Registration Progress</span>
                <span>{progress}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <motion.div
                  animate={{
                    width: `${progress}%`,
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                />
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
                        {/* Full Name */}

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full rounded-xl border py-3 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>

            {/* Email */}

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full rounded-xl border py-3 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>

            {/* Phone */}

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
                placeholder="Phone Number"
                maxLength={10}
                required
                className="w-full rounded-xl border py-3 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>

            {/* Password */}

            <div>

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
                  placeholder="Create Password"
                  required
                  className="w-full rounded-xl border py-3 pl-12 pr-12 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
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

              <div className="mt-3 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`${passwordStrength.color} h-full rounded-full transition-all duration-500`}
                  style={{
                    width: passwordStrength.width,
                  }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs">

                <span className="font-medium text-gray-500">
                  Password Strength
                </span>

                <span
                  className={`font-semibold ${
                    passwordStrength.label === "Strong"
                      ? "text-green-600"
                      : passwordStrength.label === "Medium"
                      ? "text-yellow-600"
                      : "text-red-500"
                  }`}
                >
                  {passwordStrength.label}
                </span>

              </div>
            </div>

            {/* Resident Type */}

            <div>

              <label className="mb-3 block text-sm font-semibold dark:text-white">
                Resident Type
              </label>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      resident_type: "owner",
                    }))
                  }
                  className={`rounded-xl border py-3 font-semibold transition ${
                    form.resident_type === "owner"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-gray-800 dark:text-white"
                  }`}
                >
                  Owner
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      resident_type: "tenant",
                    }))
                  }
                  className={`rounded-xl border py-3 font-semibold transition ${
                    form.resident_type === "tenant"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-gray-800 dark:text-white"
                  }`}
                >
                  Tenant
                </button>

              </div>

            </div>
                        {/* Personal Details */}

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex w-full items-center justify-between bg-gray-50 dark:bg-gray-800 px-5 py-4 font-semibold dark:text-white"
              >
                <span>Additional Details</span>

                <motion.div
                  animate={{
                    rotate: showDetails ? 180 : 0,
                  }}
                >
                  <ChevronDown size={18} />
                </motion.div>
              </button>

              <AnimatePresence>

                {showDetails && (

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-5 p-5"
                  >

                    {/* Flat Number */}

                    <div className="relative">
                      <Home
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="flat_number"
                        value={form.flat_number}
                        onChange={handleChange}
                        placeholder="Flat Number (Example: D-302)"
                        required
                        className="w-full rounded-xl border py-3 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    {/* Emergency Contact */}

                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="emergency_contact"
                        value={form.emergency_contact}
                        onChange={handleChange}
                        placeholder="Emergency Contact"
                        className="w-full rounded-xl border py-3 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    {/* Occupation */}

                    <div className="relative">
                      <Briefcase
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        name="occupation"
                        value={form.occupation}
                        onChange={handleChange}
                        placeholder="Occupation"
                        className="w-full rounded-xl border py-3 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    {/* Date of Birth */}

                    <div className="relative">
                      <Calendar
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="date"
                        name="date_of_birth"
                        value={form.date_of_birth}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border py-3 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    {/* Anniversary Date */}

                    <div className="relative">
                      <Heart
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500"
                      />

                      <input
                        type="date"
                        name="anniversary_date"
                        value={form.anniversary_date}
                        onChange={handleChange}
                        className="w-full rounded-xl border py-3 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

            {/* Admin Approval Timeline */}

            <div className="rounded-2xl border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-5">

              <div className="mb-4 flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300">
                <ShieldCheck size={20} />
                Registration Process
              </div>

              <div className="space-y-3">

                {[
                  "Create your resident account",
                  "Admin receives OTP",
                  "Verify OTP",
                  "Account approved",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-green-500"
                    />
                    {item}
                  </div>
                ))}

              </div>

            </div>
            