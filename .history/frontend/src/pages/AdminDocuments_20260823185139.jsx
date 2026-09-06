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
  