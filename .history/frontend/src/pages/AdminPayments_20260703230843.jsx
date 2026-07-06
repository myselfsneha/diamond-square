// Part 1/4

import { useEffect, useMemo, useState, useCallback } from "react";
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

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(STATUS.ALL);

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
      toast.error("Failed to load payment records.");
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
      const resident = getResidentName(payment);

      const matchesSearch = `${resident} ${
        payment.flat_number || ""
      } ${payment.amount || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === STATUS.ALL ||
        (payment.status || "")
          .toLowerCase()
          .trim() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const renderStatusBadge = (status) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        status?.toLowerCase() === "paid"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">