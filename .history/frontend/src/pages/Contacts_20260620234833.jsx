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
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Important Contacts</h1>

        {contacts.length === 0 ? (
          <p>No contacts found.</p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px"
              }}
            >
              <h3>{contact.name}</h3>
              <p>{contact.designation}</p>
              <p>{contact.phone}</p>
              <p>Category: {contact.category}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Contacts;