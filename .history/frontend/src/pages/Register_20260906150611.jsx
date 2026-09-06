import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Info,
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
    family_members: [],
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addFamilyMember = () => {
    setForm((prev) => ({
      ...prev,
      family_members: [
        ...prev.family_members,
        { name: "", relation: "", phone: "", date_of_birth: "", anniversary_date: "" },
      ],
    }));
  };

  const handleFamilyChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      family_members: prev.family_members.map((member, memberIndex) =>
        memberIndex === index ? { ...member, [field]: value } : member
      ),
    }));
  };

  const removeFamilyMember = (index) => {
    setForm((prev) => ({
      ...prev,
      family_members: prev.family_members.filter(
        (_, memberIndex) => memberIndex !== index
      ),
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
      return toast.error("Emergency contact must be 10 digits.");
    }

    if (form.password.length < 8) {
      return toast.error(
        "Password must contain at least 8 characters."
      );
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", form);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-5 py-10">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-xl"
      >

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">

          <div className="text-center mb-8">

            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg mb-5">
              <Building2 size={38} />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Diamond Square
            </h1>

            <p className="text-gray-500 mt-2">
              Create your resident account
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div className="relative">
              <User
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="relative">
              <Mail
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="relative">
              <Phone
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Resident Type
              </label>

              <select
                name="resident_type"
                value={form.resident_type}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-4 py-3 focus:ring-2 focus:ring-blue-500"
              >
                <option value="owner">Owner</option>
                <option value="tenant">Tenant</option>
              </select>
            </div>

            <div className="relative">
              <Home
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />

              <select
                name="flat_number"
                value={form.flat_number}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Flat</option>

                {Array.from({ length: 6 }, (_, floor) =>
                  Array.from({ length: 9 }, (_, flat) => {
                    const number = `${floor + 1}${String(flat + 1).padStart(2, "0")}`;

                    return (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    );
                  })
                )}
              </select>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 dark:bg-slate-900/50 dark:border-blue-800 p-4">
              <Info
                size={20}
                className="text-blue-600 mt-0.5 flex-shrink-0"
              />

              <div className="text-sm">
                <p className="font-semibold text-blue-700 dark:text-blue-300">
                  Before you continue
                </p>

                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  If someone from your family has already registered and the
                  account for this flat has been approved, use your own phone
                  number and password. We'll automatically connect you to the
                  same household if your details match the registered family
                  members.
                </p>
              </div>
            </div>
                        <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Resident Type
              </label>

              <select
                name="resident_type"
                value={form.resident_type}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-4 py-3"
              >
                <option value="owner">Owner</option>
                <option value="tenant">Tenant</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Flat Number
              </label>

              <select
                name="flat_number"
                value={form.flat_number}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white px-4 py-3"
              >
                <option value="">Select Flat</option>

                {Array.from({ length: 6 }, (_, floor) =>
                  Array.from({ length: 9 }, (_, flat) => {
                    const number = `${floor + 1}0${flat + 1}`;
                    return (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    );
                  })
                )}
              </select>
            </div>

            <div className="relative">
              <Phone
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type="text"
                name="emergency_contact"
                placeholder="Emergency Contact"
                value={form.emergency_contact}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="relative">
              <Briefcase
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type="text"
                name="occupation"
                placeholder="Occupation"
                value={form.occupation}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="relative">
              <Calendar
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="relative">
              <Heart
                className="absolute left-3 top-3.5 text-pink-400"
                size={18}
              />

              <input
                type="date"
                name="anniversary_date"
                value={form.anniversary_date}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
                        <div className="relative">
              <Calendar
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />

              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="relative">
              <Heart
                className="absolute left-3 top-3.5 text-pink-400"
                size={18}
              />

              <input
                type="date"
                name="anniversary_date"
                value={form.anniversary_date}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-4">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">
                Family Members (Optional)
              </h3>

              {form.family_members.map((member, index) => (
                <div
                  key={index}
                  className="space-y-3 border rounded-xl p-3 mb-3"
                >
                  <input
                    type="text"
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) =>
                      handleFamilyChange(index, "name", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3 dark:bg-gray-800"
                  />

                  <select
                    value={member.relation}
                    onChange={(e) =>
                      handleFamilyChange(
                        index,
                        "relation",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3 dark:bg-gray-800"
                  >
                    <option value="">Relation</option>
                    <option>Spouse</option>
                    <option>Son</option>
                    <option>Daughter</option>
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Brother</option>
                    <option>Sister</option>
                    <option>Other</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={member.phone}
                    onChange={(e) =>
                      handleFamilyChange(index, "phone", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3 dark:bg-gray-800"
                  />

                  <input
                    type="date"
                    value={member.date_of_birth}
                    onChange={(e) =>
                      handleFamilyChange(
                        index,
                        "date_of_birth",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3 dark:bg-gray-800"
                  />

                  <input
                    type="date"
                    value={member.anniversary_date}
                    onChange={(e) =>
                      handleFamilyChange(
                        index,
                        "anniversary_date",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3 dark:bg-gray-800"
                  />

                  <button
                    type="button"
                    onClick={() => removeFamilyMember(index)}
                    className="text-red-600 text-sm"
                  >
                    Remove Member
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addFamilyMember}
                className="text-blue-600 font-medium"
              >
                + Add Family Member
              </button>
            </div>

            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-4 text-sm">
              <p className="font-semibold text-amber-700 dark:text-amber-300">
                Admin Approval Required
              </p>

              <p className="mt-1 text-gray-700 dark:text-gray-300">
                Once the first member of a family is approved, every family
                member added during registration can create their own login
                using the same phone number saved by the owner. They will
                automatically access the same flat dashboard after approval.
              </p>
            </div>
                        <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg transition-all duration-300 disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Continue"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}

export default Register;