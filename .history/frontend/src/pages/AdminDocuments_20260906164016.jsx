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
  FileText,
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