import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TableEmpty from "../components/table/TableEmpty";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      alert(
        "Registration successful. Please wait for admin approval."
      );

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  const previewData = useMemo(
    () => [
      { field: "Name", value: form.name },
      { field: "Email", value: form.email },
      { field: "Phone", value: form.phone },
      {
        field: "Password",
        value: form.password
          ? "•".repeat(form.password.length)
          : "",
      },
    ],
    [form]
  );

  const filteredData = previewData.filter((item) =>
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-3xl">
        <TableHeader
          title="Create Account"
          subtitle="Register New Resident"
        />

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div className="mb-6">
            <TableSearch
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search preview..."
            />
          </div>

          {filteredData.length === 0 ? (
            <TableEmpty message="No data available." />
          ) : (
            <DataTable
              columns={columns}
              data={filteredData}
              rowKey="field"
            />
          )}

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-600 font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;