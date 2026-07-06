import { useEffect, useMemo, useState } from "react";
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
  const [statusFilter, setStatusFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
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

    const interval = setInterval(fetchBills, 15000);
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
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await api.get("/admin/residents");

      setUsers(
        Array.isArray(res.data?.residents)
          ? res.data.residents
          : []
      );
    } catch (err) {
      console.log(err);
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
        await api.put(`/maintenance/${editingId}`, form);
        alert("Bill updated successfully");
      } else {
        await api.post("/maintenance", form);
        alert("Maintenance bill created.");
      }

      resetForm();
      fetchBills();
    } catch (err) {
      console.log(err);
      alert("Failed to save bill.");
    }
  };

  const editBill = (bill) => {
    setEditingId(bill.id);

    setForm({
      user_id: bill.user_id,
      month: bill.month,
      year: bill.year,
      maintenance_amount: bill.maintenance_amount,
      water_charges: bill.water_charges,
      other_charges: bill.other_charges,
      due_date: bill.due_date?.split("T")[0] || "",
      remarks: bill.remarks || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const markPaid = async (bill) => {
    try {
      await api.put(`/maintenance/pay/${bill.id}`, {
        amount_paid: bill.total_amount,
      });

      fetchBills();
    } catch (err) {
      console.log(err);
      alert("Failed to update payment.");
    }
  };

  const deleteBill = async (id) => {
    if (!window.confirm("Delete this bill?")) return;

    try {
      await api.delete(`/maintenance/${id}`);

      setRecords((prev) =>
        prev.filter((bill) => bill.id !== id)
      );

      alert("Bill deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Delete failed.");
    }
  };