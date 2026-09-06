// AdminDocuments.jsx (Part 1 - Polished)

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FolderOpen,
  Upload,
  ScrollText,
  FileCheck,
  ClipboardList,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminDocuments() {
  const [documents, setDocuments] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const rowsPerPage = 8;

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
  });

  const [file, setFile] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/documents");

      setDocuments(
        Array.isArray(res.data?.documents)
          ? res.data.documents
          : []
      );
    } catch (err) {
      console.log(err);

      toast.error(
        "Failed to load documents."
      );

      setDocuments([]);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const uploadDocument = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.warning(
        "Please choose a document."
      );
      return;
    }

    try {
      const data = new FormData();

      data.append(
        "title",
        form.title
      );

      data.append(
        "description",
        form.description
      );

      data.append(
        "category",
        form.category
      );

      data.append(
        "document",
        file
      );

      await api.post(
        "/documents",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Document uploaded successfully."
      );

      setForm({
        title: "",
        description: "",
        category: "Other",
      });

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }

      fetchDocuments();
    } catch (err) {
      console.log(err);

      toast.error(
        "Upload failed."
      );
    }
  };

  const deleteDocument = async (id) => {
    if (
      !window.confirm(
        "Delete this document?"
      )
    )
      return;

    try {
      await api.delete(
        `/documents/${id}`
      );

      toast.success(
        "Document deleted."
      );

      fetchDocuments();
    } catch (err) {
      console.log(err);

      toast.error(
        "Delete failed."
      );
    }
  };

  const downloadDocument = (url) => {
    if (!url) {
      toast.warning(
        "File not available."
      );
      return;
    }

    window.open(url, "_blank");
  };

  const filteredDocuments =
    useMemo(() => {
      return (
        Array.isArray(documents)
          ? documents
          : []
      ).filter((doc) => {
        const matchesSearch = `${
          doc.title || ""
        } ${doc.description || ""}`
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

        const matchesCategory =
          categoryFilter === "All" ||
          doc.category ===
            categoryFilter;

        return (
          matchesSearch &&
          matchesCategory
        );
      });
    }, [
      documents,
      search,
      categoryFilter,
    ]);

  const totalDocuments =
    filteredDocuments.length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredDocuments.length /
        rowsPerPage
    )
  );

  const tableRows =
    filteredDocuments
      .slice(
        (currentPage - 1) *
          rowsPerPage,
        currentPage *
          rowsPerPage
      )
      .map((doc) => ({
        title: doc.title,

        category: (
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            {doc.category}
          </span>
        ),

        file:
          doc.file_name ||
          "Unknown",

        uploadedBy:
          doc.uploaded_by_name ||
          "Admin",

        date: new Date(
          doc.created_at
        ).toLocaleDateString(),

        actions: (
          <div className="flex gap-2">
            <button
              onClick={() =>
                downloadDocument(
                  doc.file_url
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition"
            >
              Download
            </button>

            <button
              onClick={() =>
                deleteDocument(doc.id)
              }
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
            >
              Delete
            </button>
          </div>
        ),
      }));

  const columns = [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "file",
      label: "File",
    },
    {
      key: "uploadedBy",
      label: "Uploaded By",
    },
    {
      key: "date",
      label: "Uploaded On",
    },
    {
      key: "actions",
      label: "Actions",
    },
  ];
  // AdminDocuments.jsx (Part 2 - Polished)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        <TableHeader
          title="Documents Management"
          subtitle="Upload and manage society documents"
        />

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <FolderOpen
              size={30}
              className="text-blue-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Total Documents
            </p>
            <h2 className="text-3xl font-bold dark:text-white">
              {totalDocuments}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <ScrollText
              size={30}
              className="text-purple-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Bylaws
            </p>
            <h2 className="text-3xl font-bold text-purple-600">
              {
                documents.filter(
                  (d) => d.category === "Bylaws"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <ClipboardList
              size={30}
              className="text-amber-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Forms
            </p>
            <h2 className="text-3xl font-bold text-amber-600">
              {
                documents.filter(
                  (d) => d.category === "Forms"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <FileCheck
              size={30}
              className="text-green-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Circulars
            </p>
            <h2 className="text-3xl font-bold text-green-600">
              {
                documents.filter(
                  (d) =>
                    d.category === "Circulars"
                ).length
              }
            </h2>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 dark:text-white">
            <Upload size={22} />
            Upload Document
          </h2>

          <form
            onSubmit={uploadDocument}
            className="grid md:grid-cols-2 gap-5"
          >
            <input
              type="text"
              name="title"
              placeholder="Document Title"
              value={form.title}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
              required
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
            >
              <option>Bylaws</option>
              <option>Forms</option>
              <option>Circulars</option>
              <option>Minutes</option>
              <option>Maintenance</option>
              <option>Other</option>
            </select>

            <textarea
              name="description"
              rows={4}
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 md:col-span-2 dark:bg-gray-900"
            />

            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
              className="md:col-span-2 border rounded-xl px-4 py-3 dark:bg-gray-900"
              required
            />

            <button
              type="submit"
              className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              Upload Document
            </button>
          </form>
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid lg:grid-cols-2 gap-4">
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
                setCategoryFilter(
                  e.target.value
                );
                setCurrentPage(1);
              }}
              className="border rounded-xl px-4 py-3 dark:bg-gray-900"
            >
              <option>All</option>
              <option>Bylaws</option>
              <option>Forms</option>
              <option>Circulars</option>
              <option>Minutes</option>
              <option>Maintenance</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Documents Table */}
        {tableRows.length === 0 ? (
          <TableEmpty message="No documents found." />
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
              <DataTable
                columns={columns}
                data={tableRows}
              />
            </div>

            <div className="mt-6">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default AdminDocuments;