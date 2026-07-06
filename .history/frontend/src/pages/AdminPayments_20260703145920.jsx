// Part 1/4

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchPayments();

    const interval = setInterval(fetchPayments, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchPayments = async () => {
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
      toast.error("Failed to load payment records.");
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id) => {
    try {
      setProcessingId(id);

      const res = await api.put(`/maintenance/${id}/paid`);

      const updated = res.data.payment || {
        id,
        status: "paid",
      };

      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === id
            ? { ...payment, ...updated }
            : payment
        )
      );

      toast.success("Payment marked as paid.");
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
        payment.name ||
        payment.resident_name ||
        payment.user_name ||
        "";

      const matchesSearch = `${resident} ${
        payment.flat_number || ""
      } ${payment.amount || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        (payment.status || "")
          .toLowerCase()
          .trim() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Payment Management
          </h1>

          <button
            onClick={fetchPayments}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-5 mb-6">

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Search resident, flat or amount..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
            </select>

          </div>

        </div>

        <p className="text-gray-800 dark:text-white mb-4">
          Total Payments: {filteredPayments.length}
        </p>

        <div className="space-y-4">

          {loading ? (

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
              Loading payments...
            </div>

          ) : filteredPayments.length === 0 ? (

            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
              No payment records found.
            </div>

          ) : (

            filteredPayments.map((payment) => (

              <div
                key={payment.id}
                className="bg-white rounded-xl shadow p-5"
              >

                <div className="flex flex-col md:flex-row md:justify-between">

                  <div className="flex-1">

                    <h2 className="text-xl font-semibold">
                      {payment.name ||
                        payment.resident_name ||
                        payment.user_name ||
                        "Resident"}
                    </h2>

                    {payment.flat_number && (
                      <p className="text-gray-800 dark:text-white mt-2">
                        Flat: {payment.flat_number}
                      </p>
                    )}

                    <p className="text-gray-800 dark:text-white mt-2">
                      Amount: ₹{payment.amount}
                    </p>

                    {payment.month && (
                      <p className="text-gray-800 dark:text-white">
                        Month: {payment.month}
                      </p>
                    )}

                    {payment.due_date && (
                      <p className="text-gray-800 dark:text-white">
                        Due Date:{" "}
                        {new Date(
                          payment.due_date
                        ).toLocaleDateString()}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          payment.status?.toLowerCase() === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status}
                      </span>

                    </div>

                    {payment.created_by_name && (
                      <p className="text-sm text-gray-500 mt-4">
                        Created By: {payment.created_by_name}
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

                  <div className="flex flex-col items-end mt-5 md:mt-0 md:ml-6">

                    {payment.status?.toLowerCase() !== "paid" ? (

                      <button
                        onClick={() =>
                          markAsPaid(payment.id)
                        }
                        disabled={processingId === payment.id}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg"
                      >
                        {processingId === payment.id
                          ? "Updating..."
                          : "Mark as Paid"}
                      </button>

                    ) : (

                      <button
                        disabled
                        className="bg-gray-300 text-gray-800 dark:text-white px-5 py-2 rounded-lg cursor-not-allowed"
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

      </div>

    </div>
  );
}

// Part 4/4

export default AdminPayments;