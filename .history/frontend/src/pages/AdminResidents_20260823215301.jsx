// Part 1/3

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import DataTable from "../components/table/DataTable";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

const ROWS_PER_PAGE = 10;

function AdminResidents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchResidents = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/all-users");

      const users = Array.isArray(res.data.users)
        ? res.data.users
        : [];

      users.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );

      setResidents(users);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load residents.");
      setResidents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResidents();

    const interval = setInterval(
      fetchResidents,
      10000
    );

    return () => clearInterval(interval);
  }, [fetchResidents]);

  const updateResident = (id, updates) => {
    setResidents((prev) =>
      prev.map((resident) =>
        resident.id === id
          ? { ...resident, ...updates }
          : resident
      )
    );
  };

  const toggleAdmin = async (id) => {
    try {
      const res = await api.put(
        `/admin/toggle-admin/${id}`
      );

      toast.success(res.data.message);

      const resident = residents.find(
        (r) => r.id === id
      );

      updateResident(id, {
        role:
          resident?.role === "admin"
            ? "resident"
            : "admin",
      });
    } catch (error) {
      console.error(error);

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

      const resident = residents.find(
        (r) => r.id === id
      );

      updateResident(id, {
        is_active: !resident?.is_active,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update status."
      );
    }
  };

  const approveResident = async (id) => {
    try {
      const res = await api.put(
        `/admin/approve/${id}`
      );

      toast.success("Resident approved.");

      alert(
        `Resident Approved\n\nOTP: ${res.data.otp}`
      );

      updateResident(id, {
        approval_status: "approved",
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Approval failed."
      );
    }
  };
  