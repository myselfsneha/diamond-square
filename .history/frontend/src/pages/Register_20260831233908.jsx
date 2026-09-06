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