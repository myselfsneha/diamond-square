import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/contacts");
      setContacts(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (e) => {
    e.preventDefault();

    try {
      await api.post("/contacts", {
        name: name.trim(),
        designation: designation.trim(),
        phone: phone.trim(),
        category: category.trim(),
      });

      setName("");
      setDesignation("");
      setPhone("");
      setCategory("");

      toast.success("Contact added successfully");

      fetchContacts();
    } catch (error) {
      console.error(error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add contact"
      );
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this contact?")) return;

    try {
      await api.delete(`/contacts/${id}`);

      toast.success("Contact deleted successfully");

      fetchContacts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete contact");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Admin Contacts Management
        </h1>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <form onSubmit={addContact}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
              />

              <input
                type="text"
                placeholder="Designation"
                value={designation}
                onChange={(e) =>
                  setDesignation(e.target.value)
                }
                className="border rounded-lg px-4 py-2"
                required
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="border rounded-lg px-4 py-2"
                required
              >
                <option value="">
                  Select Category
                </option>
                <option value="Management">
                  Management
                </option>
                <option value="Security">
                  Security
                </option>
                <option value="Emergency">
                  Emergency
                </option>
                <option value="Maintenance">
                  Maintenance
                </option>
                <option value="Utility">
                  Utility
                </option>
              </select>

            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Add Contact
            </button>
          </form>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-6">
            Loading contacts...
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6">
            No contacts found.
          </div>
        ) : (
          <div className="grid gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-xl shadow p-5"
              >
                <h2 className="text-xl font-semibold">
                  {contact.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  <strong>Designation:</strong>{" "}
                  {contact.designation}
                </p>

                <p className="text-gray-600">
                  <strong>Phone:</strong>{" "}
                  {contact.phone}
                </p>

                <p className="text-gray-600">
                  <strong>Category:</strong>{" "}
                  <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm ml-1">
                    {contact.category}
                  </span>
                </p>

                <button
                  onClick={() =>
                    deleteContact(contact.id)
                  }
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Delete Contact
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminContacts;