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

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
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

    const contactData = {
      name: name.trim(),
      designation: designation.trim(),
      phone: phone.trim(),
    };

    try {
      const res = await api.post("/contacts", contactData);

      setContacts((prev) => [...prev, res.data]);

      setName("");
      setDesignation("");
      setPhone("");

      toast.success("Contact added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add contact");
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this contact?")) return;

    try {
      await api.delete(`/contacts/${id}`);

      setContacts((prev) =>
        prev.filter((contact) => contact.id !== id)
      );

      toast.success("Contact deleted successfully");
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
            <div className="grid md:grid-cols-3 gap-4">
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
                onChange={(e) => setDesignation(e.target.value)}
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
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Contact
            </button>
          </form>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-5">
            Loading contacts...
          </div>
        ) : (
          <div className="grid gap-4">
            {contacts.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-5">
                No contacts found.
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white rounded-xl shadow p-5"
                >
                  <h2 className="text-xl font-semibold">
                    {contact.name}
                  </h2>

                  <p className="text-gray-600 mt-2">
                    Designation: {contact.designation}
                  </p>

                  <p className="text-gray-600">
                    Phone: {contact.phone}
                  </p>

                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete Contact
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminContacts;