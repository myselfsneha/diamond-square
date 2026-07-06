import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminDocuments() {
  const [documents, setDocuments] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

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

  const filteredDocuments = useMemo(() => {
  if (!Array.isArray(documents)) return [];

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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Documents Management
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">

          <h2 className="text-xl font-bold mb-5">
            Upload Document
          </h2>

          <form
            onSubmit={uploadDocument}
            className="grid md:grid-cols-2 gap-4"
          >

            <input
              type="text"
              name="title"
              placeholder="Document Title"
              value={form.title}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
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
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 md:col-span-2"
              rows={4}
            />

            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="md:col-span-2"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 md:col-span-2"
            >
              Upload Document
            </button>

          </form>

        </div>

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
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
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
              No documents found.
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

                      <span className="bg-gray-100 dark:bg-gray-900 text-gray-700 px-3 py-1 rounded-full text-sm">
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
                      {new Date(
                        doc.created_at
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>

                <div className="flex flex-wrap gap-3 mt-6">

                  <button
                    onClick={() =>
                      downloadDocument(doc.file_url)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                  >
                    Download
                  </button>

                  <button
                    onClick={() =>
                      deleteDocument(doc.id)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                  >
                    Delete
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

export default AdminDocuments;