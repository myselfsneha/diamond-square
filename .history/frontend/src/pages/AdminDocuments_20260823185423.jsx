// AdminDocuments.jsx (Version 2.0)
// PART 1A

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Upload,
  FileText,
  Trash2,
  Download,
  Filter,
  RefreshCw,
  FolderOpen,
  Calendar,
  User,
  FileArchive,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminDocuments() {
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const [dragging, setDragging] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
  });

  const [file, setFile] = useState(null);

  const fileInputRef = useRef(null);

  const categories = [
    "Bylaws",
    "Forms",
    "Circulars",
    "Minutes",
    "Maintenance",
    "Other",
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await api.get("/documents");

      setDocuments(
        Array.isArray(res.data.documents)
          ? res.data.documents
          : []
      );
    } catch (err) {
      console.error(err);
      setDocuments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "Other",
    });

    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadDocument = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please choose a file.");
      return;
    }

    try {
      setUploading(true);

      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);
      data.append("category", form.category);
      data.append("document", file);

      await api.post("/documents", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Document uploaded successfully.");

      resetForm();

      await fetchDocuments();
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await api.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  const downloadDocument = (url) => {
    if (!url) {
      alert("File not found.");
      return;
    }

    window.open(url, "_blank");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const dropped = e.dataTransfer.files?.[0];

    if (!dropped) return;

    setFile(dropped);

    if (fileInputRef.current) {
      fileInputRef.current.files = e.dataTransfer.files;
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = `${doc.title || ""} ${doc.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        doc.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [documents, search, categoryFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDocuments.length / rowsPerPage)
  );

  const totalDocuments = documents.length;

  const categoryCount = useMemo(() => {
    return documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {});
  }, [documents]);
  // ==============================
// AdminDocuments.jsx (Version 2.0)
// PART 1B-1
// Continue below Part 1A
// ==============================

  const tableRows = filteredDocuments
    .slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    )
    .map((doc) => ({
      title: (
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {doc.title}
            </h3>

            <p className="text-xs text-gray-500 line-clamp-1">
              {doc.description || "No description"}
            </p>
          </div>
        </div>
      ),

      category: (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
          {doc.category}
        </span>
      ),

      file: (
        <div className="flex items-center gap-2">
          <FileArchive className="w-4 h-4 text-gray-500" />
          <span className="truncate max-w-[180px]">
            {doc.file_name}
          </span>
        </div>
      ),

      uploadedBy: (
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>{doc.uploaded_by_name || "Admin"}</span>
        </div>
      ),

      date: (
        <div className="flex items-center gap-2">
          <Calendar size={15} />
          {new Date(doc.created_at).toLocaleDateString()}
        </div>
      ),

      actions: (
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadDocument(doc.file_url)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all"
          >
            <Download size={16} />
            Download
          </button>

          <button
            onClick={() => deleteDocument(doc.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      ),
    }));

  const columns = [
    { key: "title", label: "Document" },
    { key: "category", label: "Category" },
    { key: "file", label: "File" },
    { key: "uploadedBy", label: "Uploaded By" },
    { key: "date", label: "Uploaded On" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        {/* Dashboard Cards */}

        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Total Documents
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {totalDocuments}
                </h2>
              </div>

              <FolderOpen className="text-blue-600" size={34} />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Categories
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {Object.keys(categoryCount).length}
                </h2>
              </div>

              <Filter className="text-indigo-600" size={34} />
            </div>
          </motion.div>
          