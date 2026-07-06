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
      toast.error("Failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id) => {
    try {
      setProcessingId(id);

      const res = await api.put(
        `/maintenance/${id}/paid`
      );

      const updated =
        res.data.payment || {
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