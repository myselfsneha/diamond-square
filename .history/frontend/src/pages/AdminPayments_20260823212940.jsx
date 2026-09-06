import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import DataTable from "../components/table/DataTable";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

const REFRESH_INTERVAL = 10000;
const ITEMS_PER_PAGE = 10;

const STATUS = {
  ALL: "All",
  PAID: "Paid",
  PARTIAL: "Partially Paid",
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

  const [currentPage, setCurrentPage] = useState(1);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/maintenance");

      const data = Array.isArray(res.data?.maintenance)
        ? res.data.maintenance
        : Array.isArray(res.data?.payments)
        ? res.data.payments
        : Array.isArray(res.data)
        ? res.data
        : [];

      data.sort(
        (a, b) =>
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
      );

      setPayments(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payment records.");
      setPayments([]);
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

  const markAsPaid = async (payment) => {
    try {
      setProcessingId(payment.id);

      const res = await api.put(
        `/maintenance/pay/${payment.id}`,
        {
          amount_paid:
            payment.balance ||
            payment.total_amount ||
            payment.amount,
        }
      );

      const updated =
        res.data?.maintenance ||
        res.data?.payment ||
        {
          ...payment,
          status: STATUS.PAID,
          amount_paid: payment.total_amount,
          balance: 0,
        };

      setPayments((prev) =>
        prev.map((item) =>
          item.id === payment.id ? updated : item
        )
      );

      toast.success("Payment updated.");
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
      } ${payment.month || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === STATUS.ALL ||
        payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.ceil(
    filteredPayments.length / ITEMS_PER_PAGE
  );

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalCollection = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount_paid || 0),
    0
  );

  const pendingCollection = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.balance || 0),
    0
  );

  const columns = [
    {
      key: "resident",
      label: "Resident",
      render: (payment) => (
        <div>
          <div className="font-semibold">
            {getResidentName(payment)}
          </div>
          <div className="text-xs text-gray-500">
            Flat {payment.flat_number}
          </div>
        </div>
      ),
    },
    {
      key: "month",
      label: "Month",
      render: (payment) =>
        `${payment.month || "-"} ${payment.year || ""}`,
    },
    {
      key: "total",
      label: "Total",
      render: (payment) =>
        `₹${payment.total_amount || payment.amount || 0}`,
    },
    