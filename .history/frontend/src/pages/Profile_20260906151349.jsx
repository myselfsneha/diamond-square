import { useMemo, useState } from "react";
import {
  User,
  Phone,
  Mail,
  Home,
  Shield,
  Calendar,
  Edit,
  Lock,
  Users,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TableEmpty from "../components/table/TableEmpty";

function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [search, setSearch] = useState("");

  // Family Members State
  const [familyMembers, setFamilyMembers] = useState([]);

  const [memberForm, setMemberForm] = useState({
    name: "",
    relation: "",
    age: "",
    phone: "",
  });

  const handleMemberChange = (e) => {
    setMemberForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addFamilyMember = () => {
    if (!memberForm.name || !memberForm.relation) return;

    setFamilyMembers((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...memberForm,
      },
    ]);

    setMemberForm({
      name: "",
      relation: "",
      age: "",
      phone: "",
    });
  };

  const removeFamilyMember = (id) => {
    setFamilyMembers((prev) =>
      prev.filter((member) => member.id !== id)
    );
  };

  const profileData = useMemo(
    () => [
      {
        field: "Full Name",
        value: user.name || "N/A",
      },
      {
        field: "Phone Number",
        value: user.phone || "N/A",
      },
      {
        field: "Email Address",
        value: user.email || "N/A",
      },
      {
        field: "Role",
        value: user.role || "Resident",
      },
      {
        field: "Flat Number",
        value:
          user.flat_number ||
          user.flatNumber ||
          user.flat ||
          "N/A",
      },
      {
        field: "Date of Birth",
        value: user.date_of_birth || "Not Added",
      },
      {
        field: "Anniversary",
        value: user.anniversary_date || "Not Added",
      },
    ],
    [user]
  );

  const filteredData = profileData.filter((item) =>
    `${item.field} ${item.value}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "field",
      label: "Field",
    },
    {
      key: "value",
      label: "Value",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-6 py-8"
      >