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

    // NEW
    block: "C",
    floor: "",
    flat_number: "",

    emergency_contact: "",
    occupation: "",
    date_of_birth: "",
    anniversary_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  // Blocks
  const blocks = ["B", "C"];

  // Floors (1-6)
  const floors = ["1", "2", "3", "4", "5", "6"];

  // Flat numbers based on selected floor
  const flats = useMemo(() => {
    if (!form.floor) return [];

    return Array.from({ length: 9 }, (_, i) => {
      const num = Number(form.floor) * 100 + (i + 1);

      return {
        value: `${form.block}-${num}`,
        label: `${form.block}-${num}`,
      };
    });
  }, [form.block, form.floor]);

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (form.password.length >= 8) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/\d/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password)) score++;

    if (score <= 1)
      return {
        label: "Weak",
        color: "bg-red-500",
        width: "25%",
      };

    if (score <= 3)
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
      form.block,
      form.floor,
      form.flat_number,
      form.date_of_birth,
    ];

    const filled = fields.filter(Boolean).length;

    return Math.round((filled / fields.length) * 100);
  }, [form]);

  let strengthTextColor = "text-red-500";

  if (passwordStrength.label === "Medium")
    strengthTextColor = "text-yellow-600";

  if (passwordStrength.label === "Strong")
    strengthTextColor = "text-green-600";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Reset dependent dropdowns like Login page
      if (name === "block") {
        updated.floor = "";
        updated.flat_number = "";
      }

      if (name === "floor") {
        updated.flat_number = "";
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/register", form);
      toast.success("Registration successful! Please verify your email.");
      navigate("/verify-email", { state: { email: form.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Create Account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Profile Completion
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Name */}
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
              className="w-full rounded-xl border py-3 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
              placeholder="Email"
              required
              className="w-full rounded-xl border py-3 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full rounded-xl border py-3 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Password */}
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
              placeholder="Password"
              required
              className="w-full rounded-xl border py-3 pl-12 pr-12 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* Password Strength */}
          {form.password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Password Strength
                </span>
                <span className={`text-xs font-semibold ${strengthTextColor}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <motion.div
                  animate={{ width: passwordStrength.width }}
                  className={`${passwordStrength.color} h-1.5 rounded-full`}
                />
              </div>
            </div>
          )}

          {/* Resident Type */}

<div>
  <div className="mb-3 block text-sm font-semibold dark:text-white">
    Resident Type
  </div>

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
        {/* Block */}

        <div>
          <label className="mb-2 block text-sm font-medium dark:text-white">
            Block
          </label>

          <select
            name="block"
            value={form.block}
            onChange={handleChange}
            className="w-full rounded-xl border py-3 px-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            {blocks.map((block) => (
              <option key={block} value={block}>
                Block {block}
              </option>
            ))}
          </select>
        </div>

        {/* Floor */}

        <div>
          <label className="mb-2 block text-sm font-medium dark:text-white">
            Floor
          </label>

          <select
            name="floor"
            value={form.floor}
            onChange={handleChange}
            required
            className="w-full rounded-xl border py-3 px-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="">Select Floor</option>

            {floors.map((floor) => (
              <option key={floor} value={floor}>
                Floor {floor}
              </option>
            ))}
          </select>
        </div>

        {/* Flat */}

        <div>
          <label className="mb-2 block text-sm font-medium dark:text-white">
            Flat Number
          </label>

          <select
            name="flat_number"
            value={form.flat_number}
            onChange={handleChange}
            required
            disabled={!form.floor}
            className="w-full rounded-xl border py-3 px-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-50"
          >
            <option value="">
              {form.floor
                ? "Select Flat"
                : "Select Floor First"}
            </option>

            {flats.map((flat) => (
              <option
                key={flat.value}
                value={flat.value}
              >
                {flat.label}
              </option>
            ))}
          </select>
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

        {/* Anniversary */}

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
      "Verify your Email using OTP",
      "Admin reviews your request",
      "Account approved",
      "Redirect to Login",
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

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5 }}
  className="rounded-2xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4"
>
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-800">
      <Building2
        size={18}
        className="text-amber-700 dark:text-amber-300"
      />
    </div>

    <div>
      <h3 className="font-semibold text-amber-800 dark:text-amber-200">
        Registration Notice
      </h3>

      <div className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <CheckCircle2
            size={16}
            className="text-green-500"
          />
          Complete your registration form.
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2
            size={16}
            className="text-green-500"
          />
          OTP will be sent to your registered email.
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2
            size={16}
            className="text-green-500"
          />
          Verify your email to activate your request.
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2
            size={16}
            className="text-green-500"
          />
          Society Admin will verify your resident details.
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2
            size={16}
            className="text-green-500"
          />
          After approval you'll be redirected to Login and can sign in immediately.
        </div>
      </div>
    </div>
  </div>
</motion.div>

<motion.button
  whileHover={{ scale: loading ? 1 : 1.02 }}
  whileTap={{ scale: loading ? 1 : 0.98 }}
  type="submit"
  disabled={loading}
  className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60"
>
  {loading ? "Creating Account..." : "Create Account"}
</motion.button>

        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?
          </p>

          <Link
            to="/"
            className="mt-3 inline-flex items-center justify-center font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default Register;