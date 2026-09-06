import { useEffect, useMemo, useState } from "react";
import {
  User,
  Phone,
  PhoneCall,
  Briefcase,
  FileText,
  Pencil,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
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
      const { data } = await api.get("/contacts");

      setContacts(
        Array.isArray(data.contacts)
          ? data.contacts
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to load contacts."
      );
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
      if (editingId) {
        await api.put(
          `/contacts/${editingId}`,
          form
        );
      } else {
        await api.post("/contacts", form);
      }

      toast.success(
        editingId
          ? "Contact updated."
          : "Contact added."
      );

      resetForm();
      fetchContacts();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
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
      alternate_phone:
        contact.alternate_phone || "",
      notes: contact.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete contact?"))
      return;

    try {
      await api.delete(`/contacts/${id}`);

      setContacts((prev) =>
        prev.filter((item) => item.id !== id)
      );

      toast.success("Contact deleted.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Delete failed."
      );
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((item) =>
      `${item.name} ${item.designation} ${item.phone} ${item.alternate_phone} ${item.notes}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [contacts, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContacts.length / rowsPerPage)
  );

  const currentContacts =
    filteredContacts.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );

  const columns = [
    {
      key: "name",
      label: "Contact",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <User
              size={18}
              className="text-blue-600"
            />
          </div>

          <div>
            <p className="font-semibold">
              {item.name}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Briefcase size={13} />
              {item.designation}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Phone size={15} />
            {item.phone}
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <PhoneCall size={14} />
            {item.alternate_phone || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "notes",
      label: "Notes",
      render: (item) => (
        <div className="flex items-start gap-2 max-w-xs">
          <FileText
            size={15}
            className="mt-1"
          />
          <span>
            {item.notes || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              editContact(item)
            }
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
          >
            <Pencil size={15} />
            Edit
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              deleteContact(item.id)
            }
            className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
          >
            <Trash2 size={15} />
            Delete
          </motion.button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <Navbar />

      <div className="mx-auto max-w-7xl p-6">
        <TableHeader
          title="Important Contacts"
          subtitle={`${filteredContacts.length} contact${
            filteredContacts.length !== 1
              ? "s"
              : ""
          }`}
        />

        <div className="mb-6 rounded-2xl bg-white p-6 shadow dark:bg-slate-900">
          <form
            onSubmit={saveContact}
            className="grid gap-4 md:grid-cols-2"
          >
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contact Name"
              required
              className="rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="Designation"
              required
              className="rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="alternate_phone"
              value={form.alternate_phone}
              onChange={handleChange}
              placeholder="Alternate Number"
              className="rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              rows={4}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes"
              className="rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
            />

            <div className="flex gap-3 md:col-span-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                <Save size={18} />
                {editingId
                  ? "Update Contact"
                  : "Add Contact"}
              </motion.button>

              {editingId && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 rounded-xl bg-slate-500 px-6 py-3 text-white hover:bg-slate-600"
                >
                  <X size={18} />
                  Cancel
                </motion.button>
              )}
            </div>
          </form>
        </div>

        <div className="mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search contacts..."
          />
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow dark:bg-slate-900">
            Loading contacts...
          </div>
        ) : filteredContacts.length === 0 ? (
          <TableEmpty message="No contacts found." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentContacts}
              keyField="id"
            />

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredContacts.length}
              pageSize={rowsPerPage}
              onPrevious={() =>
                setPage((p) =>
                  Math.max(1, p - 1)
                )
              }
              onNext={() =>
                setPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminContacts;