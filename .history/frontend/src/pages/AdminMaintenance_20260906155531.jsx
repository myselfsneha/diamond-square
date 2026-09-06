import { useEffect, useMemo, useState } from "react";
import {
  Receipt,
  CheckCircle2,
  Clock3,
  IndianRupee,
  FilePlus2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

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
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [editingId, setEditingId] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

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

    const interval = setInterval(
      fetchBills,
      15000
    );

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

      toast.error(
        "Failed to load maintenance bills."
      );

      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await api.get(
        "/admin/residents"
      );

      setUsers(
        Array.isArray(res.data?.residents)
          ? res.data.residents
          : []
      );
    } catch (err) {
      console.log(err);

      toast.error(
        "Failed to load residents."
      );

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
        await api.put(
          `/maintenance/${editingId}`,
          form
        );

        toast.success(
          "Maintenance bill updated."
        );
      } else {
        await api.post(
          "/maintenance",
          form
        );

        toast.success(
          "Maintenance bill created."
        );
      }

      resetForm();
      fetchBills();
    } catch (err) {
      console.log(err);

      toast.error(
        "Failed to save maintenance bill."
      );
    }
  };

  const editBill = (bill) => {
    setEditingId(bill.id);

    setForm({
      user_id: bill.user_id,
      month: bill.month,
      year: bill.year,
      maintenance_amount:
        bill.maintenance_amount,
      water_charges: bill.water_charges,
      other_charges: bill.other_charges,
      due_date:
        bill.due_date?.split("T")[0] || "",
      remarks: bill.remarks || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const markPaid = async (bill) => {
    try {
      await api.put(
        `/maintenance/pay/${bill.id}`,
        {
          amount_paid: bill.total_amount,
        }
      );

      toast.success(
        "Payment updated successfully."
      );

      fetchBills();
    } catch (err) {
      console.log(err);

      toast.error(
        "Failed to update payment."
      );
    }
  };

  const deleteBill = async (id) => {
    if (!window.confirm("Delete this bill?"))
      return;

    try {
      await api.delete(
        `/maintenance/${id}`
      );

      setRecords((prev) =>
        prev.filter(
          (bill) => bill.id !== id
        )
      );

      toast.success(
        "Maintenance bill deleted."
      );
    } catch (err) {
      console.log(err);

      toast.error("Delete failed.");
    }
  };
    const filteredBills = useMemo(() => {
    return (
      Array.isArray(records)
        ? records
        : []
    ).filter((bill) => {
      const matchesSearch = `${bill.name || ""} ${
        bill.flat_number || ""
      }`
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
          <div className="font-semibold text-gray-900 dark:text-white">
            {bill.name}
          </div>

          <div className="text-xs text-gray-500">
            Flat {bill.flat_number}
          </div>
        </div>
      ),
    },
    {
      key: "month",
      label: "Month",
      render: (bill) => (
        <span className="font-medium">
          {bill.month} {bill.year}
        </span>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (bill) => (
        <span className="font-semibold">
          ₹{bill.total_amount}
        </span>
      ),
    },
    {
      key: "paid",
      label: "Paid",
      render: (bill) => (
        <span className="text-green-600 font-semibold">
          ₹{bill.amount_paid}
        </span>
      ),
    },
    {
      key: "balance",
      label: "Balance",
      render: (bill) => (
        <span className="text-red-600 font-semibold">
          ₹{bill.balance}
        </span>
      ),
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
        <div className="flex flex-wrap gap-2">

          <button
            onClick={() => editBill(bill)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg transition"
          >
            Edit
          </button>

          {bill.status !== "Paid" && (
            <button
              onClick={() => markPaid(bill)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition"
            >
              Mark Paid
            </button>
          )}

          <button
            onClick={() =>
              deleteBill(bill.id)
            }
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
          >
            Delete
          </button>

        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        <TableHeader
          title="Maintenance Management"
          subtitle="Manage maintenance bills"
        />

        <div className="grid md:grid-cols-4 gap-5 mb-8">

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Receipt
              size={30}
              className="text-blue-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Total Bills
            </p>
            <h2 className="text-3xl font-bold dark:text-white">
              {totalBills}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <CheckCircle2
              size={30}
              className="text-green-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Paid
            </p>
            <h2 className="text-3xl font-bold text-green-600">
              {paidBills}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Clock3
              size={30}
              className="text-red-500 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Pending
            </p>
            <h2 className="text-3xl font-bold text-red-600">
              {pendingBills}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <IndianRupee
              size={30}
              className="text-purple-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Collection
            </p>
            <h2 className="text-3xl font-bold text-purple-600">
              ₹{totalCollection}
            </h2>
          </div>

        </div>
                {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-500 text-sm">Total Bills</p>
            <h2 className="text-3xl font-bold mt-2">{totalBills}</h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-100 dark:border-green-700 p-6">
            <p className="text-gray-500 text-sm">Paid</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {paidBills}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-100 dark:border-red-700 p-6">
            <p className="text-gray-500 text-sm">Pending</p>
            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {pendingBills}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-700 p-6">
            <p className="text-gray-500 text-sm">Collection</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              ₹{totalCollection}
            </h2>
          </div>
        </div>

        {/* Create / Edit Bill */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
            {editingId ? "Edit Maintenance Bill" : "Create Maintenance Bill"}
          </h2>

          <form
            onSubmit={saveBill}
            className="grid md:grid-cols-2 gap-5"
          >
            <select
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
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
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
              required
            />

            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
              required
            />

            <input
              type="number"
              name="maintenance_amount"
              placeholder="Maintenance Amount"
              value={form.maintenance_amount}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
              required
            />

            <input
              type="number"
              name="water_charges"
              placeholder="Water Charges"
              value={form.water_charges}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
            />

            <input
              type="number"
              name="other_charges"
              placeholder="Other Charges"
              value={form.other_charges}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
            />

            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
              required
            />

            <textarea
              name="remarks"
              rows={3}
              placeholder="Remarks"
              value={form.remarks}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 md:col-span-2 dark:bg-gray-900"
            />

            <div className="md:col-span-2 flex gap-4 pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition"
              >
                {editingId ? "Update Bill" : "Create Bill"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
                {/* Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <TableSearch
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by resident or flat..."
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-xl px-4 py-3 dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">
              Partially Paid
            </option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Bills Table */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-10 text-center">
            <p className="text-gray-500">
              Loading maintenance bills...
            </p>
          </div>
        ) : paginatedBills.length === 0 ? (
          <TableEmpty message="No maintenance bills found." />
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
              <DataTable
                columns={columns}
                data={paginatedBills}
                rowKey="id"
              />
            </div>

            <div className="mt-6">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default AdminMaintenance;