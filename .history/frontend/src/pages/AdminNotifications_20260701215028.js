import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminNotifications() {
  // ==========================================
  // STATES
  // ==========================================
  const [notifications, setNotifications] = useState([]);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "General",
    is_active: 1,
  });

  // ==========================================
  // LOAD DATA
  // ==========================================
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : value,
    });
  };

  // ==========================================
  // SAVE / UPDATE
  // ==========================================
  const saveNotification = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/notifications/${editingId}`,
          form
        );

        alert("Notification updated.");
      } else {
        await api.post(
          "/notifications",
          form
        );

        alert("Notification created.");
      }

      setEditingId(null);

      setForm({
        title: "",
        message: "",
        type: "General",
        is_active: 1,
      });

      fetchNotifications();
    } catch (err) {
      console.log(err);
      alert("Operation failed.");
    }
  };

  // ==========================================
  // EDIT
  // ==========================================
  const editNotification = (notification) => {
    setEditingId(notification.id);

    setForm({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      is_active: notification.is_active,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

    // ==========================================
  // DELETE
  // ==========================================
  const deleteNotification = async (id) => {
    if (!window.confirm("Delete this notification?")) {
      return;
    }

    try {
      await api.delete(`/notifications/${id}`);

      alert("Notification deleted.");

      fetchNotifications();
    } catch (err) {
      console.log(err);
      alert("Delete failed.");
    }
  };

  // ==========================================
  // FILTERED DATA
  // ==========================================
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesSearch =
        `${item.title} ${item.message}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        typeFilter === "All" ||
        item.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [notifications, search, typeFilter]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Notification Management
        </h1>

        {/* ===============================
            CREATE / EDIT FORM
        ================================ */}

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h2 className="text-xl font-bold mb-5">
            {editingId
              ? "Edit Notification"
              : "Create Notification"}
          </h2>

          <form
            onSubmit={saveNotification}
            className="grid md:grid-cols-2 gap-4"
          >

            <input
              type="text"
              name="title"
              placeholder="Notification Title"
              value={form.title}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option>General</option>
              <option>Maintenance</option>
              <option>Emergency</option>
              <option>Event</option>
            </select>

            <textarea
              name="message"
              placeholder="Notification Message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="border rounded-lg px-4 py-2 md:col-span-2"
              required
            />

            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active === 1}
                onChange={handleChange}
              />
              Active Notification
            </label>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 md:col-span-2"
            >
              {editingId
                ? "Update Notification"
                : "Create Notification"}
            </button>

          </form>

        </div>

        {/* ===============================
            SEARCH & FILTER
        ================================ */}

        <div className="bg-white rounded-xl shadow p-5 mb-6">

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Search notification..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border rounded-lg px-4 py-2"
            />

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="border rounded-lg px-4 py-2"
            >
              <option>All</option>
              <option>General</option>
              <option>Maintenance</option>
              <option>Emergency</option>
              <option>Event</option>
            </select>

          </div>

        </div>

                {/* ===============================
            NOTIFICATION LIST
        ================================ */}

        <div className="space-y-4">

          {filteredNotifications.length === 0 ? (

            <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
              No notifications found.
            </div>

          ) : (

            filteredNotifications.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-5"
              >

                <div className="flex flex-col md:flex-row md:justify-between">

                  <div>

                    <h2 className="text-xl font-bold">
                      {item.title}
                    </h2>

                    <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                      {item.message}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">

                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {item.type}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          item.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>

                    </div>

                  </div>

                  <div className="text-right mt-4 md:mt-0">

                    <p className="text-gray-500">
                      Created By
                    </p>

                    <p className="font-semibold">
                      {item.created_by_name || "Admin"}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>

                  </div>

                </div>

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() => editNotification(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteNotification(item.id)}
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

export default AdminNotifications;