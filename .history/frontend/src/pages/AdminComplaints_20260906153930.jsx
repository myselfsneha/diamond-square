import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchComplaints();

    const interval = setInterval(() => {
      fetchComplaints();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await api.get("/complaints");

      setComplaints(
        Array.isArray(res.data)
          ? res.data
          : res.data.complaints || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/complaints/${id}`, {
        status,
      });

      if (res.data.message) {
        setComplaints((prev) =>
          prev.map((complaint) =>
            complaint.id === id
              ? {
                  ...complaint,
                  status,
                }
              : complaint
          )
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update complaint"
      );
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm("Delete this complaint?"))
      return;

    try {
      const res = await api.delete(
        `/complaints/${id}`
      );

      setComplaints((prev) =>
        prev.filter(
          (complaint) => complaint.id !== id
        )
      );

      toast.success(
        res.data.message ||
          "Complaint deleted successfully"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete complaint"
      );
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) =>
      `${complaint.title || ""} ${complaint.description || ""} ${complaint.name || ""} ${complaint.phone || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [complaints, search]);

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const progressComplaints = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredComplaints.length / rowsPerPage
    )
  );

  const currentComplaints =
    filteredComplaints.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };