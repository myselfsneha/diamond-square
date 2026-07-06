import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    designation: "",
    phone: "",
    alternate_phone: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);

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

  const saveContact = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (editingId) {
        res = await api.put(
          `/contacts/${editingId}`,
          form
        );
      } else {
        res = await api.post("/contacts", form);
      }

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
      const res = await api.delete(
        `/contacts/${id}`
      );

      setContacts((prev) =>
        prev.filter((contact) => contact.id !== id)
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

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) =>
      `${c.name} ${c.designation} ${c.phone} ${
        c.alternate_phone || ""
      } ${c.notes || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [contacts, search]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Important Contacts
        </h1>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
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
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={form.designation}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <input
              type="text"
              name="alternate_phone"
              placeholder="Alternate Phone"
              value={form.alternate_phone}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            />

            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              className="border rounded-lg px-4 py-2 md:col-span-2"
            />

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                {editingId
                  ? "Update Contact"
                  : "Add Contact"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search Contact..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border rounded-lg px-4 py-2 w-full mb-6"
        />

        {/* Contact List */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            Loading...
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center text-gray-500">
            No contacts found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col md:flex-row md:justify-between md:items-center"
              >
                <div>
                  <h2 className="text-xl font-bold">
                    {contact.name}
                  </h2>

                  <p className="text-gray-800 dark:text-white mt-1">
                    {contact.designation}
                  </p>

                  <p className="mt-2">
                    📞 {contact.phone}
                  </p>

                  <p>
                    📱 Alternate:{" "}
                    {contact.alternate_phone ||
                      "N/A"}
                  </p>

                  {contact.notes && (
                    <p className="mt-2 text-gray-800 dark:text-white">
                      📝 {contact.notes}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                  <button
                    onClick={() =>
                      editContact(contact)
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteContact(contact.id)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminContacts;