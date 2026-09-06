import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  CheckCircle2,
  LogIn,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);

      const res = await api.get("/visitors");

      setVisitors(
        Array.isArray(res.data?.visitors)
          ? res.data.visitors
          : []
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load visitors");
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  };

  const addVisitor = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      await api.post("/visitors", {
        visitor_name: name,
        phone,
        purpose,
        resident_id: user.id,
      });

      toast.success("Visitor request created");

      setName("");
      setPhone("");
      setPurpose("");

      fetchVisitors();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add visitor"
      );
    }
  };

  const approveVisitor = async (id) => {
    try {
      await api.put(`/visitors/approve/${id}`);

      setVisitors((prev) =>
        prev.map((visitor) =>
          visitor.id === id
            ? {
                ...visitor,
                status: "Approved",
              }
            : visitor
        )
      );

      toast.success("Visitor approved");
    } catch (error) {
      console.error(error);
      toast.error("Approval failed");
    }
  };

  const markEntry = async (id) => {
    try {
      await api.put(`/visitors/entry/${id}`);

      setVisitors((prev) =>
        prev.map((visitor) =>
          visitor.id === id
            ? {
                ...visitor,
                status: "Entered",
                entry_time:
                  new Date().toLocaleString(),
              }
            : visitor
        )
      );

      toast.success("Visitor entered");
    } catch (error) {
      console.error(error);
      toast.error("Failed");
    }
  };

  const markExit = async (id) => {
    try {
      await api.put(`/visitors/exit/${id}`);

      setVisitors((prev) =>
        prev.map((visitor) =>
          visitor.id === id
            ? {
                ...visitor,
                status: "Exited",
                exit_time:
                  new Date().toLocaleString(),
              }
            : visitor
        )
      );

      toast.success("Visitor exited");
    } catch (error) {
      console.error(error);
      toast.error("Failed");
    }
  };

  const deleteVisitor = async (id) => {
    if (!window.confirm("Delete visitor?"))
      return;

    try {
      await api.delete(`/visitors/${id}`);

      setVisitors((prev) =>
        prev.filter(
          (visitor) => visitor.id !== id
        )
      );

      toast.success("Visitor deleted");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const filteredVisitors = useMemo(() => {
    return (
      Array.isArray(visitors)
        ? visitors
        : []
    ).filter((visitor) =>
      `${visitor.name || ""} ${
        visitor.phone || ""
      } ${visitor.purpose || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [visitors, search]);

  const totalVisitors = visitors.length;

  const approvedVisitors = visitors.filter(
    (v) => v.status === "Approved"
  ).length;

  const enteredVisitors = visitors.filter(
    (v) => v.status === "Entered"
  ).length;

  const exitedVisitors = visitors.filter(
    (v) => v.status === "Exited"
  ).length;

  const totalPages = Math.ceil(
    filteredVisitors.length / rowsPerPage
  );

  const currentVisitors =
    filteredVisitors.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );

  const getStatusClass = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Entered") return "bg-amber-100 text-amber-700";
    if (status === "Exited") return "bg-purple-100 text-purple-700";
    return "bg-slate-100 text-slate-700";
  };

  const columns = [
    {
      key: "visitor_name",
      label: "Visitor",
      render: (row) => (
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {row.visitor_name || row.name || "-"}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => row.phone || "-",
    },
    {
      key: "purpose",
      label: "Purpose",
      render: (row) => row.purpose || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
            row.status
          )}`}
        >
          {row.status || "Pending"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {row.status !== "Approved" && (
            <button
              type="button"
              onClick={() => approveVisitor(row.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              Approve
            </button>
          )}

          {row.status === "Approved" && (
            <button
              type="button"
              onClick={() => markEntry(row.id)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              Enter
            </button>
          )}

          {row.status === "Entered" && (
            <button
              type="button"
              onClick={() => markExit(row.id)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              Exit
            </button>
          )}

          <button
            type="button"
            onClick={() => deleteVisitor(row.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  let tableContent;

  if (loading) {
    tableContent = (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-10 text-center">
        <p className="text-gray-500">
          Loading visitors...
        </p>
      </div>
    );
  } else if (filteredVisitors.length === 0) {
    tableContent = (
      <TableEmpty message="No visitors found." />
    );
  } else {
    tableContent = (
      <>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
          <DataTable
            columns={columns}
            data={currentVisitors}
            rowKey="id"
          />
        </div>

        <div className="mt-6">
          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        <TableHeader
          title="Visitor Management"
          subtitle="Manage visitor approvals and entry logs"
        />

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Users
              size={30}
              className="text-blue-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Total Visitors
            </p>
            <h2 className="text-3xl font-bold dark:text-white">
              {totalVisitors}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <CheckCircle2
              size={30}
              className="text-green-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Approved
            </p>
            <h2 className="text-3xl font-bold text-green-600">
              {approvedVisitors}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <LogIn
              size={30}
              className="text-amber-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Entered
            </p>
            <h2 className="text-3xl font-bold text-amber-600">
              {enteredVisitors}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <LogOut
              size={30}
              className="text-purple-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Exited
            </p>
            <h2 className="text-3xl font-bold text-purple-600">
              {exitedVisitors}
            </h2>
          </div>
        </div>

        {/* Add Visitor */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
            <UserPlus size={22} />
            Add Visitor
          </h2>

          <form
            onSubmit={addVisitor}
            className="grid md:grid-cols-3 gap-5"
          >
            <input
              type="text"
              placeholder="Visitor Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
              required
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
              required
            />

            <input
              type="text"
              placeholder="Purpose"
              value={purpose}
              onChange={(e) =>
                setPurpose(e.target.value)
              }
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
              required
            />

            <div className="md:col-span-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition"
              >
                Add Visitor
              </button>
            </div>
          </form>
        </div>

        {/* Search */}
        <div className="mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search visitors..."
          />
        </div>

        {/* Table */}
        {tableContent}
      </motion.div>
    </div>
  );
}

export default AdminVisitors;