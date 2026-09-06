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
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl text-white p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            <div className="flex items-center gap-5">

              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                <User size={48} />
              </div>

              <div>
                <h1 className="text-4xl font-bold">
                  {user.name || "Resident"}
                </h1>

                <p className="opacity-90 mt-2">
                  {user.role?.toUpperCase()}
                </p>

                <p className="opacity-80">
                  Flat {user.flat_number || "--"}
                </p>
              </div>

            </div>

            <div className="flex gap-3">

              <Link
                to="/edit-profile"
                className="flex items-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                <Edit size={18} />
                Edit Profile
              </Link>

              <Link
                to="/change-password"
                className="flex items-center gap-2 bg-black/20 px-5 py-3 rounded-xl hover:bg-black/30 transition"
              >
                <Lock size={18} />
                Change Password
              </Link>

            </div>

          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-8">

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Phone className="text-blue-600 mb-4" />

            <p className="text-gray-500 text-sm">
              Phone
            </p>

            <h3 className="font-bold text-lg dark:text-white">
              {user.phone || "--"}
            </h3>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Mail className="text-green-600 mb-4" />

            <p className="text-gray-500 text-sm">
              Email
            </p>

            <h3 className="font-bold text-lg dark:text-white break-all">
              {user.email || "--"}
            </h3>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Home className="text-purple-600 mb-4" />

            <p className="text-gray-500 text-sm">
              Flat
            </p>

            <h3 className="font-bold text-lg dark:text-white">
              {user.flat_number || "--"}
            </h3>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Shield className="text-red-500 mb-4" />

            <p className="text-gray-500 text-sm">
              Role
            </p>

            <h3 className="font-bold text-lg capitalize dark:text-white">
              {user.role || "Resident"}
            </h3>
          </div>

        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">

          <TableHeader
            title="Profile Information"
            subtitle="Your personal details"
          />

          <div className="mt-5 mb-6">

            <TableSearch
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search profile..."
            />

          </div>

          {filteredData.length === 0 ? (

            <TableEmpty message="No profile information found." />

          ) : (

            <DataTable
              columns={columns}
              data={filteredData}
              rowKey="field"
            />

          )}

        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8"></div>