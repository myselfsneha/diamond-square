import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await api.get("/visitors");

      setVisitors(
        Array.isArray(res.data.visitors)
          ? res.data.visitors
          : []
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load visitors");
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  };

  const addVisitor = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await api.post("/visitors", {
        visitor_name: name,
        phone,
        purpose,
        resident_id: user.id,
      });

      toast.success("Visitor request created");

      setName("");
      setPhone("");
      setPurpose("");

      fetchVisitors();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to add visitor"
      );
    }
  };

  const approveVisitor = async (id) => {
    try {
      await api.put(`/visitors/approve/${id}`);

      setVisitors((prev) =>
        prev.map((visitor) =>
          visitor.id === id
            ? { ...visitor, status: "Approved" }
            : visitor
        )
      );

      toast.success("Visitor approved");
    } catch (error) {
      console.error(error);
      toast.error("Approval failed");
    }
  };

  const markEntry = async (id) => {
    try {
      await api.put(`/visitors/entry/${id}`);

      setVisitors((prev) =>
        prev.map((visitor) =>
          visitor.id === id
            ? {
                ...visitor,
                status: "Entered",
                entry_time: new Date().toLocaleString(),
              }
            : visitor
        )
      );

      toast.success("Visitor entered");
    } catch (error) {
      console.error(error);
      toast.error("Failed");
    }
  };

  const markExit = async (id) => {
    try {
      await api.put(`/visitors/exit/${id}`);

      setVisitors((prev) =>
        prev.map((visitor) =>
          visitor.id === id
            ? {
                ...visitor,
                status: "Exited",
                exit_time: new Date().toLocaleString(),
              }
            : visitor
        )
      );

      toast.success("Visitor exited");
    } catch (error) {
      console.error(error);
      toast.error("Failed");
    }
  };

  const deleteVisitor = async (id) => {
    if (!window.confirm("Delete visitor?")) return;

    try {
      await api.delete(`/visitors/${id}`);

      setVisitors((prev) =>
        prev.filter((visitor) => visitor.id !== id)
      );

      toast.success("Visitor deleted");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };
  