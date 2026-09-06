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

  const renderContactsTable = () => {
    if (loading) {
      return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 py-20 text-center text-slate-500">
          Loading contacts...
        </div>
      );
    }

    if (filteredContacts.length === 0) {
      return <TableEmpty message="No contacts found." />;
    }

    return (
      <>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <DataTable
            columns={columns}
            data={currentContacts}
            rowKey="id"
          />
        </div>

        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <TableHeader
          title="Important Contacts"
          subtitle={`${filteredContacts.length} Contact${
            filteredContacts.length !== 1 ? "s" : ""
          }`}
        />

        {/* Contact Form */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {editingId ? "Edit Contact" : "Add Contact"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Save important emergency and society contacts.
            </p>
          </div>

          <form
            onSubmit={saveContact}
            className="p-6 grid md:grid-cols-2 gap-5"
          >
            <input
              type="text"
              name="name"
              placeholder="Contact Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={form.designation}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="text"
              name="alternate_phone"
              placeholder="Alternate Phone"
              value={form.alternate_phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              rows={4}
              name="notes"
              placeholder="Additional Notes"
              value={form.notes}
              onChange={handleChange}
              className="md:col-span-2 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
              >
                {editingId ? "Update Contact" : "Add Contact"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Search */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search contacts..."
          />
        </section>

        {/* Table */}
        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 py-20 text-center text-slate-500">
            Loading contacts...
          </div>
        ) : filteredContacts.length === 0 ? (
          <TableEmpty message="No contacts found." />
        ) : (
          <>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <DataTable
                columns={columns}
                data={currentContacts}
                rowKey="id"
              />
            </div>

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}

      </main>
    </div>
  );
}

export default AdminContacts;