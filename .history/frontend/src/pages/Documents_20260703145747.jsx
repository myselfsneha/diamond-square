import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      console.log(err);
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
      const matchesSearch = `${doc.title} ${doc.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        doc.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [documents, search, categoryFilter]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Society Documents
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
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
        </div>

        <div className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center text-gray-500">
              No documents available.
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-5"
              >
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {doc.title}
                    </h2>

                    <p className="text-gray-800 dark:text-white mt-2">
                      {doc.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {doc.category}
                      </span>

                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {doc.file_name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right mt-4 md:mt-0">
                    <p className="text-gray-500">
                      Uploaded By
                    </p>

                    <p className="font-semibold">
                      {doc.uploaded_by_name || "Admin"}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => downloadDocument(doc.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Documents;