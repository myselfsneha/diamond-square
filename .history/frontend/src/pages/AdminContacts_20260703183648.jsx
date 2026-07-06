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
      const res = await api.get("/contacts");

      setContacts(
        Array.isArray(res.data.contacts)
          ? res.data.contacts
          : Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to load contacts"
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
      const res = editingId
        ? await api.put(`/contacts/${editingId}`, form)
        : await api.post("/contacts", form);

      toast.success(
        res.data.message ||
          (editingId
            ? "Contact updated successfully"
            : "Contact added successfully")
      );

      resetForm();
      fetchContacts();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to save contact"
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
    if (!window.confirm("Delete this contact?"))
      return;

    try {
      const res = await api.delete(`/contacts/${id}`);

      setContacts((prev) =>
        prev.filter((c) => c.id !== id)
      );

      toast.success(
        res.data.message ||
          "Contact deleted successfully"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete contact"
      );
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) =>
      `${c.name} ${c.designation} ${c.phone} ${
        c.alternate_phone || ""
      } ${c.notes || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [contacts, search]);

  const totalPages = Math.ceil(
    filteredContacts.length / rowsPerPage
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
      render: (row) =>
        row.alternate_phone || "N/A",
    },
    {
      key: "notes",
      label: "Notes",
      render: (row) => row.notes || "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => editContact(row)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
          >
            Edit
          </button>

          <button
            onClick={() => deleteContact(row.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <TableHeader
          title="Important Contacts"
          subtitle={`Total Contacts: ${filteredContacts.length}`}
        />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <form
            onSubmit={saveContact}
            className="grid md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Contact Name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
              required
            />

            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={form.designation}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
              required
            />

            <input
              type="text"
              name="alternate_phone"
              placeholder="Alternate Phone"
              value={form.alternate_phone}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
            />

            <textarea
              rows={3}
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 md:col-span-2 dark:bg-gray-700 dark:text-white"
            />

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {editingId
                  ? "Update Contact"
                  : "Add Contact"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 text-gray-900 dark:text-white">
            Loading...
          </div>
        ) : filteredContacts.length === 0 ? (
          <TableEmpty message="No contacts found." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentContacts}
              rowKey="id"
            />

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminContacts;