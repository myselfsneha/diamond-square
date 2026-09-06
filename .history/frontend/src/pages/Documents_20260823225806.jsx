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