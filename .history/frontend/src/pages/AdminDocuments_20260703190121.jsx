// AdminDocuments.jsx (Part 1)

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminDocuments() {
  const [documents, setDocuments] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
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
        Array.isArray(res.data.documents)
          ? res.data.documents
          : []
      );
    } catch (err) {
      console.log(err);
      setDocuments([]);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const uploadDocument = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please choose a file.");
      return;
    }

    try {
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

      setForm({
        title: "",
        description: "",
        category: "Other",
      });

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchDocuments();
    } catch (err) {
      console.log(err);
      alert("Upload failed.");
    }
  };

  const deleteDocument = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await api.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      console.log(err);
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

  // Search + Filter
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

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDocuments.length / rowsPerPage)
  );

  const tableRows = filteredDocuments
    .slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    )
    .map((doc) => ({
      title: doc.title,
      category: (
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
          {doc.category}
        </span>
      ),
      file: doc.file_name,
      uploadedBy: doc.uploaded_by_name || "Admin",
      date: new Date(doc.created_at).toLocaleDateString(),
      actions: (
        <div className="flex gap-2">
          <button
            onClick={() => downloadDocument(doc.file_url)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Download
          </button>

          <button
            onClick={() => deleteDocument(doc.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ),
    }));

  const columns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "file", label: "File" },
    { key: "uploadedBy", label: "Uploaded By" },
    { key: "date", label: "Uploaded On" },
    { key: "actions", label: "Actions" },
  ];