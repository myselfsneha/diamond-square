import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchNotices();

    const interval = setInterval(() => {
      fetchNotices();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);

      const res = await api.get("/notices");

      setNotices(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      title: "",
      description: "",
    });
  };

  const saveNotice = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/notices/${editingId}`, form);

        setNotices((prev) =>
          prev.map((notice) =>
            notice.id === editingId
              ? { ...notice, ...form }
              : notice
          )
        );

        alert("Notice updated successfully");
      } else {
        const res = await api.post("/notices", form);

        setNotices((prev) => [res.data, ...prev]);

        alert("Notice created successfully");
      }

      resetForm();
    } catch (error) {
      console.log(error);
      alert("Failed to save notice");
    }
  };

  const editNotice = (notice) => {
    setEditingId(notice.id);

    setForm({
      title: notice.title,
      description: notice.description,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;

    try {
      await api.delete(`/notices/${id}`);

      setNotices((prev) =>
        prev.filter((notice) => notice.id !== id)
      );

      alert("Notice deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete notice");
    }
  };

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) =>
      `${notice.title} ${notice.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [notices, search]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Notice Management
          </h1>

          <button
            onClick={fetchNotices}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-5">
            {editingId ? "Edit Notice" : "Create Notice"}
          </h2>

          <form
            onSubmit={saveNotice}
            className="space-y-4"
          >
            <input
              type="text"
              name="title"
              placeholder="Notice Title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            <textarea
              name="description"
              placeholder="Notice Description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
                        <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {editingId ? "Update Notice" : "Create Notice"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <p className="text-gray-600 mb-4">
          Total Notices: {filteredNotices.length}
        </p>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl shadow p-6 text-center">
              Loading...
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
              No notices found.
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-xl shadow p-5"
              >
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">
                      {notice.title}
                    </h2>

                    <p className="text-gray-700 mt-3 whitespace-pre-wrap">
                      {notice.description}
                    </p>

                    {notice.created_at && (
                      <p className="text-sm text-gray-400 mt-4">
                        Posted:{" "}
                        {new Date(
                          notice.created_at
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                                    <div className="flex gap-3 mt-5 md:mt-0 md:ml-6">
                    <button
                      onClick={() => editNotice(notice)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteNotice(notice.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
          </div>
  );
}

export default AdminNotices;