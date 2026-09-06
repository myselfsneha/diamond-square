import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  Wallet,
  IndianRupee,
  CheckCircle2,
  Clock3,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import api from "../services/api";

const REFRESH_INTERVAL = 10000;

const STATUS = {
  ALL: "All",
  PAID: "Paid",
  PENDING: "Pending",
};

const getResidentName = (payment) =>
  payment.name ||
  payment.resident_name ||
  payment.user_name ||
  "Resident";

const TableHeader = ({ title, subtitle }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      {title}
    </h1>
    <p className="mt-2 text-gray-600 dark:text-gray-300">
      {subtitle}
    </p>
  </div>
);

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] =
    useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState(STATUS.ALL);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/maintenance");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.payments || [];

      data.sort(
        (a, b) =>
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
      );

      setPayments(data);
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to load payment records."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();

    const interval = setInterval(
      fetchPayments,
      REFRESH_INTERVAL
    );

    return () => clearInterval(interval);
  }, [fetchPayments]);

  const markAsPaid = async (id) => {
    try {
      setProcessingId(id);

      const res = await api.put(
        `/maintenance/${id}/paid`
      );

      const updated = res.data.payment || {
        id,
        status: "Paid",
      };

      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === id
            ? { ...payment, ...updated }
            : payment
        )
      );

      toast.success(
        "Payment marked as paid."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update payment."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const resident =
        getResidentName(payment);

      const matchesSearch = `${resident} ${
        payment.flat_number || ""
      } ${payment.amount || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === STATUS.ALL ||
        (payment.status || "")
          .toLowerCase()
          .trim() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [
    payments,
    search,
    statusFilter,
  ]);

  const totalPayments =
    filteredPayments.length;

  const paidPayments =
    filteredPayments.filter(
      (p) =>
        p.status?.toLowerCase() === "paid"
    ).length;

  const pendingPayments =
    filteredPayments.filter(
      (p) =>
        p.status?.toLowerCase() !== "paid"
    ).length;

  const totalCollection =
    filteredPayments.reduce(
      (sum, p) =>
        sum +
        Number(
          p.amount_paid ||
            p.amount ||
            0
        ),
      0
    );

  const renderStatusBadge = (status) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        status?.toLowerCase() === "paid"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        <TableHeader
          title="Payment Management"
          subtitle="Track and manage maintenance payments"
        />

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Wallet
              size={30}
              className="text-blue-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Total Payments
            </p>
            <h2 className="text-3xl font-bold dark:text-white">
              {totalPayments}
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
              {paidPayments}
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
              {pendingPayments}
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

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search resident, flat or amount..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
            >
              <option>{STATUS.ALL}</option>
              <option>{STATUS.PAID}</option>
              <option>{STATUS.PENDING}</option>
            </select>

            <button
              onClick={fetchPayments}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Payment Cards */}
        <div className="space-y-6">
          {loading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-10 text-center">
              <p className="text-gray-500">
                Loading payment records...
              </p>
            </div>
          )}

          {!loading && filteredPayments.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-10 text-center">
              <p className="text-gray-500">
                No payment records found.
              </p>
            </div>
          )}

          {!loading && filteredPayments.length > 0 && (
            filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {getResidentName(payment)}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm">
                      {payment.flat_number && (
                        <p>
                          <strong>Flat:</strong>{" "}
                          {payment.flat_number}
                        </p>
                      )}

                      <p>
                        <strong>Amount:</strong> ₹
                        {payment.amount}
                      </p>

                      {payment.month && (
                        <p>
                          <strong>Month:</strong>{" "}
                          {payment.month}
                        </p>
                      )}

                      {payment.due_date && (
                        <p>
                          <strong>Due Date:</strong>{" "}
                          {new Date(
                            payment.due_date
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="mt-5">
                      {renderStatusBadge(
                        payment.status
                      )}
                    </div>

                    {payment.created_by_name && (
                      <p className="text-sm text-gray-500 mt-5">
                        Created By:{" "}
                        {payment.created_by_name}
                      </p>
                    )}

                    {payment.created_at && (
                      <p className="text-sm text-gray-500">
                        Created:{" "}
                        {new Date(
                          payment.created_at
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center">
                    {payment.status?.toLowerCase() !==
                    "paid" ? (
                      <button
                        onClick={() =>
                          markAsPaid(payment.id)
                        }
                        disabled={
                          processingId ===
                          payment.id
                        }
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl transition"
                      >
                        {processingId ===
                        payment.id
                          ? "Updating..."
                          : "Mark as Paid"}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white px-6 py-3 rounded-xl cursor-not-allowed"
                      >
                        Paid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default AdminPayments;