import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Home,
  Shield,
  Calendar,
  Edit,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import TableHeader from "../components/table/TableHeader";
import TableEmpty from "../components/table/TableEmpty";

function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [familyMembers, setFamilyMembers] = useState([]);

  const [memberForm, setMemberForm] = useState({
    name: "",
    relation: "",
    age: "",
    phone: "",
  });

  const formatDate = (date) => {
    if (!date) return "Not Added";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition">
      <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </p>

        <p className="font-semibold text-gray-800 dark:text-white mt-1 break-all">
          {value || "Not Added"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-6 py-8"
      >
        {/* Hero */}

        <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white mb-8">

          <div className="flex flex-col lg:flex-row items-center justify-between p-8 gap-8">

            <div className="flex items-center gap-6">

              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
                <User size={50} />
              </div>

              <div>

                <h1 className="text-4xl font-bold">
                  {user.name || "Resident"}
                </h1>

                <p className="mt-2 uppercase tracking-wider text-blue-100">
                  {user.role || "Resident"}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full">
                  <Home size={18} />
                  Flat {user.flat_number || "--"}
                </div>

              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                to="/edit-profile"
                className="flex items-center gap-2 rounded-xl bg-white text-blue-700 px-5 py-3 font-semibold hover:bg-gray-100 transition"
              >
                <Edit size={18} />
                Edit Profile
              </Link>

              <Link
                to="/change-password"
                className="flex items-center gap-2 rounded-xl bg-black/20 px-5 py-3 hover:bg-black/30 transition"
              >
                <Lock size={18} />
                Change Password
              </Link>

            </div>

          </div>

        </div>

        {/* Personal Information */}

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8">

          <TableHeader
            title="Personal Information"
            subtitle="Your account details"
          />

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <InfoItem
              icon={<User size={20} />}
              label="Full Name"
              value={user.name}
            />

            <InfoItem
              icon={<Mail size={20} />}
              label="Email Address"
              value={user.email}
            />

            <InfoItem
              icon={<Phone size={20} />}
              label="Phone Number"
              value={user.phone}
            />

            <InfoItem
              icon={<Home size={20} />}
              label="Flat"
              value={user.flat_number}
            />

            <InfoItem
              icon={<Shield size={20} />}
              label="Role"
              value={user.role}
            />

            <InfoItem
              icon={<Calendar size={20} />}
              label="Birthday"
              value={formatDate(user.date_of_birth)}
            />

            <InfoItem
              icon={<Calendar size={20} />}
              label="Anniversary"
              value={formatDate(user.anniversary_date)}
            />

          </div>

        </div>
                {/* Family Members */}

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">

          <TableHeader
            title="Family Members"
            subtitle="Manage members living in your flat"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

            <input
              type="text"
              name="name"
              placeholder="Member Name"
              value={memberForm.name}
              onChange={handleMemberChange}
              className="rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              name="relation"
              placeholder="Relation"
              value={memberForm.relation}
              onChange={handleMemberChange}
              className="rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={memberForm.age}
              onChange={handleMemberChange}
              className="rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={memberForm.phone}
              onChange={handleMemberChange}
              className="rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          <button
            onClick={addFamilyMember}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-medium transition"
          >
            <Plus size={18} />
            Add Family Member
          </button>

          <div className="mt-8">

            {familyMembers.length === 0 ? (

              <TableEmpty message="No family members added yet." />

            ) : (

              <div className="space-y-4">

                {familyMembers.map((member) => (

                  <div
                    key={member.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col lg:flex-row justify-between lg:items-center gap-6"
                  >

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">

                      <div>
                        <p className="text-sm text-gray-500">
                          Name
                        </p>

                        <p className="font-semibold dark:text-white mt-1">
                          {member.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Relation
                        </p>

                        <p className="font-semibold dark:text-white mt-1">
                          {member.relation}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Age
                        </p>

                        <p className="font-semibold dark:text-white mt-1">
                          {member.age || "--"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Phone
                        </p>

                        <p className="font-semibold dark:text-white mt-1">
                          {member.phone || "--"}
                        </p>
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        removeFamilyMember(member.id)
                      }
                      className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl px-5 py-3 transition"
                    >
                      <Trash2 size={18} />
                      Remove
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </motion.div>
    </div>
  );
}
export default Profile;