import { useEffect, useMemo, useState } from "react";
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
      const res = await api.get("/visitors");

      setVisitors(
        Array.isArray(res.data.visitors)
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
      const user = JSON.parse(localStorage.getItem("user"));

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
        error.response?.data?.message || "Failed to add visitor"
      );
    }
  };

  const approveVisitor = async (id) => {
    try {
      await api.put(`/visitors/approve/${id}`);

      setVisitors((prev) =>
        prev.map((visitor) =>
          visitor.id === id
            ? { ...visitor, status: "Approved" }
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
                entry_time: new Date().toLocaleString(),
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
                exit_time: new Date().toLocaleString(),
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
    if (!window.confirm("Delete visitor?")) return;

    try {
      await api.delete(`/visitors/${id}`);

      setVisitors((prev) =>
        prev.filter((visitor) => visitor.id !== id)
      );

      toast.success("Visitor deleted");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };
    const filteredVisitors = useMemo(() => {
    return (Array.isArray(visitors) ? visitors : []).filter((visitor) =>
      `${visitor.name || ""} ${visitor.phone || ""} ${
        visitor.purpose || ""
      }`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [visitors, search]);

  const totalPages = Math.ceil(
    filteredVisitors.length / rowsPerPage
  );

  const currentVisitors = filteredVisitors.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const columns = [
    {
      key: "name",
      label: "Visitor",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "purpose",
      label: "Purpose",
    },
    {
      key: "status",
      label: "Status",
      render: (visitor) => visitor.status || "Pending",
    },
    {
      key: "entry_time",
      label: "Entry",
      render: (visitor) => visitor.entry_time || "-",
    },
    {
      key: "exit_time",
      label: "Exit",
      render: (visitor) => visitor.exit_time || "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (visitor) => (
        <div className="flex flex-wrap gap-2">
          {(visitor.status || "Pending") === "Pending" && (
            <button
              onClick={() => approveVisitor(visitor.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
            >
              Approve
            </button>
          )}

          {visitor.status === "Approved" && (
            <button
              onClick={() => markEntry(visitor.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
            >
              Entry
            </button>
          )}

          {visitor.status === "Entered" && (
            <button
              onClick={() => markExit(visitor.id)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg"
            >
              Exit
            </button>
          )}

          <button
            onClick={() => deleteVisitor(visitor.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <TableHeader
          title="Visitor Management"
          subtitle={`Total Visitors: ${filteredVisitors.length}`}
        />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <form onSubmit={addVisitor}>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Visitor Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
              />

              <input
                type="text"
                placeholder="Purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Add Visitor
            </button>
          </form>
        </div>