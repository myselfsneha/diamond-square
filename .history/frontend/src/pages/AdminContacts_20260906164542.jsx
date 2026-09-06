import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import DataTable from "../components/table/DataTable";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    designation: "",
    phone: "",
    alternate_phone: "",
    notes: "",
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/contacts");

      setContacts(
        Array.isArray(res.data?.contacts)
          ? res.data.contacts
          : Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to load contacts."
      );
      setContacts([]);
    } finally {
      setLoading(false);
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
      name: "",
      designation: "",
      phone: "",
      alternate_phone: "",
      notes: "",
    });
  };

  const saveContact = async (e) => {
    e.preventDefault();

    try {
      const res = editingId
        ? await api.put(`/contacts/${editingId}`, form)
        : await api.post("/contacts", form);

      toast.success(
        res.data?.message ||
          (editingId
            ? "Contact updated successfully."
            : "Contact added successfully.")
      );

      resetForm();
      fetchContacts();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to save contact."
      );
    }
  };

  const editContact = (contact) => {
    setEditingId(contact.id);

    setForm({
      name: contact.name,
      designation: contact.designation,
      phone: contact.phone,
      alternate_phone: contact.alternate_phone || "",
      notes: contact.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this contact?")) return;

    try {
      const res = await api.delete(`/contacts/${id}`);

      setContacts((prev) =>
        prev.filter((contact) => contact.id !== id)
      );

      toast.success(
        res.data?.message ||
          "Contact deleted successfully."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete contact."
      );
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      `${contact.name} ${contact.designation} ${contact.phone}
       ${contact.alternate_phone || ""} ${contact.notes || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [contacts, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContacts.length / rowsPerPage)
  );

  const currentContacts = filteredContacts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "designation",
      label: "Designation",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "alternate_phone",
      label: "Alternate",
      render: (row) => row.alternate_phone || "—",
    },
    {
      key: "notes",
      label: "Notes",
      render: (row) => row.notes || "—",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => editContact(row)}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition"
          >
            Edit
          </button>

          <button
            onClick={() => deleteContact(row.id)}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  