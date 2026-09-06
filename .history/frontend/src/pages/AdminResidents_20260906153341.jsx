import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Search,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { toast } from "react-toastify";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminResidents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/all-users");

      setResidents(
        Array.isArray(res.data.users)
          ? res.data.users
          : []
      );
    } catch (error) {
      console.error(error);
      setResidents([]);
      toast.error("Failed to load residents.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (id) => {
    try {
      const res = await api.put(
        `/admin/toggle-admin/${id}`
      );

      toast.success(res.data.message);

      setResidents((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                role:
                  user.role === "admin"
                    ? "resident"
                    : "admin",
              }
            : user
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update role."
      );
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await api.put(
        `/admin/toggle-status/${id}`
      );

      toast.success(res.data.message);

      setResidents((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                is_active: !user.is_active,
              }
            : user
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update status."
      );
    }
  };

  const deleteResident = async (id) => {
    if (!window.confirm("Delete this resident?"))
      return;

    try {
      const res = await api.delete(
        `/admin/delete-user/${id}`
      );

      toast.success(res.data.message);

      setResidents((prev) =>
        prev.filter((user) => user.id !== id)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete resident."
      );
    }
  };

  const approveResident = async (id) => {
    try {
      const res = await api.put(
        `/admin/approve/${id}`
      );

      toast.success(
        "Resident approved successfully!"
      );

      alert(
        `Resident Approved!\n\nOTP:\n${res.data.otp}`
      );

      fetchResidents();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to approve resident."
      );
    }
  };

  const filteredResidents = useMemo(() => {
    return residents.filter((resident) =>
      `${resident.name} ${resident.email}
      ${resident.phone}
      ${resident.flat_number}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [residents, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredResidents.length / rowsPerPage)
  );

  const currentResidents = filteredResidents.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalResidents = residents.length;

  const approvedResidents = residents.filter(
    (r) => r.approval_status === "approved"
  ).length;

  const pendingResidents = residents.filter(
    (r) => r.approval_status === "pending"
  ).length;

  const admins = residents.filter(
    (r) => r.role === "admin"
  ).length;

  const columns = [