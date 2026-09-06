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