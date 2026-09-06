import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Search,
  Filter,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/documents");

      setDocuments(
        Array.isArray(res.data)
          ? res.data
          : res.data.documents || []
      );
    } catch (err) {
      console.log(err);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = (id) => {
    window.open(
      `${process.env.REACT_APP_API_URL}/documents/download/${id}`,
      "_blank"
    );
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = `${doc.title || ""} ${
        doc.description || ""
      } ${doc.category || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        doc.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [documents, search, categoryFilter]);

  const totalPages = Math.ceil(
    filteredDocuments.length / rowsPerPage
  );

  const currentDocuments = filteredDocuments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const stats = [
    {
      title: "Total Documents",
      value: filteredDocuments.length,
      color:
        "from-blue-500 to-indigo-600",
      icon: <FileText size={26} />,
    },
    {
      title: "Categories",
      value: [
        ...new Set(
          documents.map((d) => d.category)
        ),
      ].filter(Boolean).length,
      color:
        "from-purple-500 to-pink-600",
      icon: <FolderOpen size={26} />,
    },
  ];

  const categoryOptions = [
    "All",
    "Bylaws",
    "Forms",
    "Circulars",
    "Minutes",
    "Maintenance",
    "Other",
  ];

  const columns = [
    {
      key: "title",
      label: "Document",
      render: (doc) => (
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
            <FileText size={18} />
          </div>

          <div>
            <div className="font-semibold">
              {doc.title}
            </div>

            <div className="text-xs text-gray-500">
              {doc.file_name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (doc) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
          {doc.category}
        </span>
      ),
    },
        {
      key: "uploaded_by_name",
      label: "Uploaded By",
      render: (doc) => (
        <span className="font-medium">
          {doc.uploaded_by_name || "Admin"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Uploaded",
      render: (doc) =>
        doc.created_at
          ? new Date(doc.created_at).toLocaleDateString()
          : "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (doc) => (
        <button
          onClick={() => downloadDocument(doc.id)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white transition hover:scale-105"
        >
          <Download size={16} />
          Download
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <TableHeader
          title="Society Documents"
          subtitle={`Total Documents: ${filteredDocuments.length}`}
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {stats.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-3xl bg-gradient-to-r ${item.color} p-6 text-white shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="opacity-80">
                    {item.title}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {item.value}
                  </h2>
                </div>

                <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                  {item.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 rounded-3xl border border-white/20 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900/70"
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TableSearch
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search documents..."
              />
            </div>

            <button
              onClick={fetchDocuments}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {categoryOptions.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setCategoryFilter(category);
                  setPage(1);
                }}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  categoryFilter === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-blue-100 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>