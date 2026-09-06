import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Users, ShieldCheck, Search } from "lucide-react";
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
      key: "category",
      label: "Category",
    },
    {
      key: "phone",
      label: "Phone",
      render: (contact) => (
        <a
          href={`tel:${contact.phone}`}
          className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
        >
          {contact.phone}
        </a>
      ),
    },
  ];

  const emergencyContacts = contacts.filter(
    (c) =>
      c.category?.toLowerCase().includes("emergency") ||
      c.category?.toLowerCase().includes("security")
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <TableHeader
          title="Important Contacts"
          subtitle={`Total Contacts: ${filteredContacts.length}`}
        />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 my-8"
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Total Contacts</p>
                <h2 className="text-3xl font-bold mt-2">
                  {contacts.length}
                </h2>
              </div>
              <Users className="text-blue-600" size={34} />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Emergency</p>
                <h2 className="text-3xl font-bold text-red-600 mt-2">
                  {emergencyContacts}
                </h2>
              </div>
              <ShieldCheck className="text-red-600" size={34} />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Search Results</p>
                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {filteredContacts.length}
                </h2>
              </div>
              <Search className="text-green-600" size={34} />
            </div>
          </div>
        </motion.div>
        