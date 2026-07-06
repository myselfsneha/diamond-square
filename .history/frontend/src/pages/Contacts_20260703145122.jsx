import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Contacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
  try {
    const res = await api.get("/contacts");

    setContacts(
      Array.isArray(res.data.contacts)
        ? res.data.contacts
        : []
    );
  } catch (err) {
    console.log(err);
    setContacts([]);
  }
};

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Important Contacts
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-xl shadow p-5"
            >
              <h2 className="text-xl font-bold">
                {contact.name}
              </h2>

              <p className="text-gray-800 dark:text-white mt-2">
                {contact.designation}
              </p>

              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mt-3">
                {contact.category}
              </span>

              <a
                href={`tel:${contact.phone}`}
                className="block mt-5 bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg"
              >
                📞 {contact.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contacts;