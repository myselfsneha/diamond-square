import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get("/notices");
      setNotices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createNotice = async (e) => {
    e.preventDefault();

    try {
      await api.post("/notices", form);

      setForm({
        title: "",
        description: "",
      });

      fetchNotices();

      alert("Notice created successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to create notice");
    }
  };

  const deleteNotice = async (id) => {
    try {
      await api.delete(`/notices/${id}`);

      setNotices((prev) =>
        prev.filter((notice) => notice.id !== id)
      );
    } catch (error) {
      console.log(error);
      alert("Failed to delete notice");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Manage Notices
        </h1>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Create Notice
          </h2>

          <form onSubmit={createNotice}>
            <input
              type="text"
              name="title"
              placeholder="Notice Title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 mb-4"
              required
            />

            <textarea
              name="description"
              placeholder="Notice Description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg px-4 py-2 mb-4"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Notice
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-xl shadow p-5"
            >
              <h3 className="text-xl font-semibold">
                {notice.title}
              </h3>

              <p className="text-gray-700 mt-2">
                {notice.description}
              </p>

              <button
                onClick={() => deleteNotice(notice.id)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete Notice
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminNotices;