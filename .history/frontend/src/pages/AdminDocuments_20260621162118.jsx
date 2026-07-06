import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/documents");
      setDocuments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addDocument = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/documents", {
        title,
        description,
        file_url: fileUrl,
      });

      setDocuments([res.data, ...documents]);

      setTitle("");
      setDescription("");
      setFileUrl("");

      alert("Document added successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to add document");
    }
  };

  const deleteDocument = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await api.delete(`/documents/${id}`);

      setDocuments(
        documents.filter((doc) => doc.id !== id)
      );

      alert("Document deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete document");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Admin Documents Management
        </h1>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <form onSubmit={addDocument}>
            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Document Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded-lg px-4 py-2"
                rows="3"
              />

              <input
                type="text"
                placeholder="Document URL (PDF link)"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Document
              </button>
            </div>
          </form>
        </div>

        <div className="grid gap-4">
          {documents.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-5">
              No documents found.
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow p-5"
              >
                <h2 className="text-xl font-semibold">
                  {doc.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  {doc.description}
                </p>

                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-medium"
                >
                  View Document
                </a>

                <br />

                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete Document
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDocuments;