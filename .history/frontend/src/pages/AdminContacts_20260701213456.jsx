import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminContacts() {

  // =============================
  // State
  // =============================
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    designation: "",
    phone: "",
    category: "Committee",
  });

  const [editingId, setEditingId] = useState(null);

  // =============================
  // Load Contacts
  // =============================
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get("/contacts");
      setContacts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =============================
  // Handle Input
  // =============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =============================
  // Save Contact
  // =============================
  const saveContact = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/contacts/${editingId}`, form);
      } else {
        await api.post("/contacts", form);
      }

      resetForm();
      fetchContacts();
    } catch (err) {
      console.log(err);
      alert("Failed to save contact.");
    }
  };

  // =============================
  // Edit Contact
  // =============================
  const editContact = (contact) => {
    setEditingId(contact.id);

    setForm({
      name: contact.name,
      designation: contact.designation,
      phone: contact.phone,
      category: contact.category,
    });
  };

  // =============================
  // Delete Contact
  // =============================
  const deleteContact = async (id) => {

    if (!window.confirm("Delete this contact?"))
      return;

    try {
      await api.delete(`/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      console.log(err);
      alert("Delete failed.");
    }
  };

  // =============================
  // Reset Form
  // =============================
  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      designation: "",
      phone: "",
      category: "Committee",
    });
  };

  // =============================
  // Search Filter
  // =============================
  const filteredContacts = useMemo(() => {

    return contacts.filter((c) =>
      `${c.name} ${c.designation} ${c.category}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [contacts, search]);

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Important Contacts
        </h1>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">

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

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option>Committee</option>
              <option>Security</option>
              <option>Emergency</option>
              <option>Maintenance</option>
              <option>Other</option>
            </select>

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg md:col-span-2"
            >
              {editingId ? "Update Contact" : "Add Contact"}
            </button>

          </form>

        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search Contact..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full mb-6"
        />

                {/* Contact List */}
        <div className="space-y-4">

          {filteredContacts.length === 0 ? (

            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
              No contacts found.
            </div>

          ) : (

            filteredContacts.map((contact) => (

              <div
                key={contact.id}
                className="bg-white rounded-xl shadow p-5 flex flex-col md:flex-row md:justify-between md:items-center"
              >

                {/* Contact Details */}
                <div>

                  <h2 className="text-xl font-bold">
                    {contact.name}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    {contact.designation}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {contact.category}
                    </span>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {contact.phone}
                    </span>

                  </div>

                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4 md:mt-0">

                  <button
                    onClick={() => editContact(contact)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminContacts;