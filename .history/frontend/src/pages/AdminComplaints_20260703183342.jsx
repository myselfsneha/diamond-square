import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
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
              ? { ...complaint, status }
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
    if (!window.confirm("Delete this complaint?")) return;

    try {
      const res = await api.delete(`/complaints/${id}`);

      setComplaints((prev) =>
        prev.filter((complaint) => complaint.id !== id)
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

  const totalPages = Math.ceil(
    filteredComplaints.length / rowsPerPage
  );

  const currentComplaints = filteredComplaints.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "text-green-600 font-semibold";
      case "In Progress":
        return "text-blue-600 font-semibold";
      case "Pending":
        return "text-yellow-600 font-semibold";
      default:
        return "text-gray-700 dark:text-white";
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "name",
      label: "Resident",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "status",
      label: "Status",
      render: (complaint) => (
        <span className={getStatusColor(complaint.status)}>
          {complaint.status}
        </span>
      ),
    },
    