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
          // ==============================
// AdminDocuments.jsx (Version 2.0)
// PART 1B-2
// Continue directly below Part 1B-1
// ==============================

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">
                  Search Results
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {filteredDocuments.length}
                </h2>
              </div>

              <Sparkles className="text-emerald-600" size={34} />
            </div>
          </motion.div>
        </div>

        {/* Upload Section */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
        >
          <TableHeader title="Documents Management" />

          <form
            onSubmit={uploadDocument}
            className="grid md:grid-cols-2 gap-5 mt-6"
          >
            <input
              type="text"
              name="title"
              placeholder="Document Title"
              value={form.title}
              onChange={handleChange}
              required
              className="rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-3"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="md:col-span-2 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-3 resize-none"
            />

            <div
              className={`md:col-span-2 border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                dragging
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                required
                className="hidden"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
              />

              <div className="flex flex-col items-center text-center">
                <Upload
                  className="text-blue-600 mb-3"
                  size={42}
                />

                <h3 className="font-semibold text-lg dark:text-white">
                  Drag & Drop your document
                </h3>

                <p className="text-gray-500 mt-1">
                  or click below to browse
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  Choose File
                </button>

                {file && (
                  <div className="mt-6 w-full max-w-lg rounded-xl bg-gray-100 dark:bg-gray-900 p-4">
                    <div className="flex items-center gap-3">
                      <FileText
                        className="text-blue-600"
                        size={22}
                      />

                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium truncate dark:text-white">
                          {file.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                disabled={uploading}
                className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={uploading}
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60 transition"
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </form>
        </motion.div>
        // ==============================
// AdminDocuments.jsx (Version 2.0)
// PART 1B-3
// Continue directly below Part 1B-2
// ==============================

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">

            <div className="flex-1">
              <TableSearch
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by title or description..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">

              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-3 min-w-[180px]"
              >
                {["All", ...categories.filter((c) => c !== "All")].map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>

              {(search || categoryFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("All");
                    setCurrentPage(1);
                  }}
                  className="px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {(search || categoryFilter !== "All") && (
            <div className="mt-5 flex flex-wrap gap-3">

              {search && (
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 text-sm">
                  Search:
                  <strong>{search}</strong>
                </span>
              )}

              {categoryFilter !== "All" && (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 text-sm">
                  Category:
                  <strong>{categoryFilter}</strong>
                </span>
              )}

            </div>
          )}
        </motion.div>

        {/* Documents Table */}

        {tableRows.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <TableEmpty message="No documents found." />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >// ==============================
// AdminDocuments.jsx (Version 2.0)
// PART 1B-4
// Continue directly below Part 1B-3
// ==============================

        {/* Documents Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <TableSearch
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search documents..."
              />

              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-3"
              >
                <option value="All">All Categories</option>
                {categories
                  .filter((c) => c !== "All")
                  .map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="p-6">
            {tableRows.length === 0 ? (
              <TableEmpty message="No documents found." />
            ) : (
              <>
                <DataTable
                  columns={columns}
                  data={tableRows}
                />

                <div className="mt-6">
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPrevious={() =>
                      setCurrentPage((page) =>
                        Math.max(page - 1, 1)
                      )
                    }
                    onNext={() =>
                      setCurrentPage((page) =>
                        Math.min(page + 1, totalPages)
                      )
                    }
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          Diamond Square Admin Panel • Version 2.0
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDocuments;</motion.div>