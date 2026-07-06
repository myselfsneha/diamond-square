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
      setContacts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Important Contacts
        </h1>

        {contacts.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-5">
            No contacts found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-xl shadow p-5"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {contact.name}
                </h3>

                <p className="text-gray-700">
                  Role: {contact.role}
                </p>

                <p className="text-gray-700">
                  Phone: {contact.phone}
                </p>

                {contact.email && (
                  <p className="text-gray-700">
                    Email: {contact.email}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Contacts;