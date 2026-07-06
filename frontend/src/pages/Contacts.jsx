import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

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

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      `${contact.name || ""} ${contact.designation || ""} ${
        contact.category || ""
      } ${contact.phone || ""}`
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
      key: "category",
      label: "Category",
    },
    {
      key: "phone",
      label: "Phone",
      render: (contact) => (
        <a
          href={`tel:${contact.phone}`}
          className="text-blue-600 hover:underline"
        >
          {contact.phone}
        </a>
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

        {filteredContacts.length === 0 ? (
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

export default Contacts;