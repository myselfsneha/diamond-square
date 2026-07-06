import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import DataTable from "../components/table/DataTable";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminMaintenance() {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    user_id: "",
    month: "",
    year: new Date().getFullYear(),
    maintenance_amount: "",
    water_charges: "",
    other_charges: "",
    due_date: "",
    remarks: "",
  });

  useEffect(() => {
    fetchBills();
    fetchResidents();

    const interval = setInterval(fetchBills, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);

      const res = await api.get("/maintenance");

      setRecords(
        Array.isArray(res.data?.maintenance)
          ? res.data.maintenance
          : []
      );
    } catch (err) {
      console.log(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await api.get("/admin/residents");

      setUsers(
        Array.isArray(res.data?.residents)
          ? res.data.residents
          : []
      );
    } catch (err) {
      console.log(err);
      setUsers([]);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      user_id: "",
      month: "",
      year: new Date().getFullYear(),
      maintenance_amount: "",
      water_charges: "",
      other_charges: "",
      due_date: "",
      remarks: "",
    });
  };

  const saveBill = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/maintenance/${editingId}`, form);
        alert("Bill updated successfully");
      } else {
        await api.post("/maintenance", form);
        alert("Maintenance bill created.");
      }

      resetForm();
      fetchBills();
    } catch (err) {
      console.log(err);
      alert("Failed to save bill.");
    }
  };

  const editBill = (bill) => {
    setEditingId(bill.id);

    setForm({
      user_id: bill.user_id,
      month: bill.month,
      year: bill.year,
      maintenance_amount: bill.maintenance_amount,
      water_charges: bill.water_charges,
      other_charges: bill.other_charges,
      due_date: bill.due_date?.split("T")[0] || "",
      remarks: bill.remarks || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const markPaid = async (bill) => {
    try {
      await api.put(`/maintenance/pay/${bill.id}`, {
        amount_paid: bill.total_amount,
      });

      fetchBills();
    } catch (err) {
      console.log(err);
      alert("Failed to update payment.");
    }
  };

  const deleteBill = async (id) => {
    if (!window.confirm("Delete this bill?")) return;

    try {
      await api.delete(`/maintenance/${id}`);

      setRecords((prev) =>
        prev.filter((bill) => bill.id !== id)
      );

      alert("Bill deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Delete failed.");
    }
  };
    const filteredBills = useMemo(() => {
    return (Array.isArray(records) ? records : []).filter((bill) => {
      const matchesSearch = `${bill.name || ""} ${bill.flat_number || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        bill.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const totalBills = records.length;

  const paidBills = records.filter(
    (r) => r.status === "Paid"
  ).length;

  const pendingBills = records.filter(
    (r) => r.status !== "Paid"
  ).length;

  const totalCollection = records.reduce(
    (sum, r) => sum + Number(r.amount_paid || 0),
    0
  );

  const totalPages = Math.ceil(
    filteredBills.length / itemsPerPage
  );

  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      key: "resident",
      label: "Resident",
      render: (bill) => (
        <div>
          <div className="font-semibold">{bill.name}</div>
          <div className="text-xs text-gray-500">
            Flat {bill.flat_number}
          </div>
        </div>
      ),
    },
    {
      key: "month",
      label: "Month",
      render: (bill) => `${bill.month} ${bill.year}`,
    },
    {
      key: "total",
      label: "Total",
      render: (bill) => `₹${bill.total_amount}`,
    },
    {
      key: "paid",
      label: "Paid",
      render: (bill) => `₹${bill.amount_paid}`,
    },
    {
      key: "balance",
      label: "Balance",
      render: (bill) => `₹${bill.balance}`,
    },
    {
      key: "status",
      label: "Status",
      render: (bill) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            bill.status === "Paid"
              ? "bg-green-100 text-green-700"
              : bill.status === "Partially Paid"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {bill.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (bill) => (
        <div className="flex gap-2">
          <button
            onClick={() => editBill(bill)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            Edit
          </button>

          {bill.status !== "Paid" && (
            <button
              onClick={() => markPaid(bill)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            >
              Paid
            </button>
          )}

          <button
            onClick={() => deleteBill(bill.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
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
          title="Maintenance Management"
          subtitle="Manage maintenance bills"
        />

        <div className="grid md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">Total Bills</p>
            <h2 className="text-2xl font-bold">{totalBills}</h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">Paid</p>
            <h2 className="text-2xl font-bold text-green-600">
              {paidBills}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">Pending</p>
            <h2 className="text-2xl font-bold text-red-600">
              {pendingBills}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <p className="text-gray-500 text-sm">
              Collection
            </p>
            <h2 className="text-2xl font-bold text-blue-600">
              ₹{totalCollection}
            </h2>
          </div>

        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">

          <form
            onSubmit={saveBill}
            className="grid md:grid-cols-2 gap-4"
          >            <select
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            >
              <option value="">Select Resident</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.flat_number})
                </option>
              ))}
            </select>

            <input
              type="text"
              name="month"
              placeholder="Month"
              value={form.month}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              type="number"
              name="maintenance_amount"
              placeholder="Maintenance Amount"
              value={form.maintenance_amount}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              type="number"
              name="water_charges"
              placeholder="Water Charges"
              value={form.water_charges}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="number"
              name="other_charges"
              placeholder="Other Charges"
              value={form.other_charges}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <textarea
              name="remarks"
              placeholder="Remarks"
              value={form.remarks}
              onChange={handleChange}
              rows={3}
              className="border rounded-lg px-4 py-2 md:col-span-2"
            />

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {editingId ? "Update Bill" : "Create Bill"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <TableSearch
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search resident..."
        />

        <div className="flex justify-end mb-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-lg px-4 py-2"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
            Loading...
          </div>
        ) : paginatedBills.length === 0 ? (
          <TableEmpty message="No maintenance bills found." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={paginatedBills}
            />

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminMaintenance;