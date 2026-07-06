import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/documents");

      setDocuments(
        Array.isArray(res.data)
          ? res.data
          : res.data.documents || []
      );
    } catch (err) {
      console.log(err);
      setDocuments([]);
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
      const matchesSearch = `${doc.title || ""} ${doc.description || ""}`
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
      key: "file_name",
      label: "File",
    },
    {
      key: "uploaded_by_name",
      label: "Uploaded By",
      render: (doc) => doc.uploaded_by_name || "Admin",
    },
    {
      key: "created_at",
      label: "Date",
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
        >
          Download
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <TableHeader
          title="Society Documents"
          subtitle={`Total Documents: ${filteredDocuments.length}`}
        />

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search documents..."
          />

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded-lg px-4 py-2"
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

        {filteredDocuments.length === 0 ? (
          <TableEmpty message="No documents available." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentDocuments}
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

export default Documents;