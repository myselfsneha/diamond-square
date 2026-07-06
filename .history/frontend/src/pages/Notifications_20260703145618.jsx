import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Notifications() {
  // ======================================
  // STATES
  // ======================================

  const [notifications, setNotifications] = useState([]);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("All");

  // ======================================
  // LOAD NOTIFICATIONS
  // ======================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await api.get(
        `/notifications/resident/${user.id}`
      );

      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ======================================
  // MARK AS READ
  // ======================================

  const markAsRead = async (id) => {
    try {
      await api.post(
        `/notifications/read/${id}`
      );

      fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  // ======================================
  // FILTER DATA
  // ======================================

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
  }, [
    notifications,
    search,
    typeFilter,
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Notifications
        </h1>

        {/* ======================================
            SEARCH & FILTER
        ======================================= */}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

        {/* ======================================
            NOTIFICATION LIST
        ======================================= */}

        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center text-gray-500">
              No notifications available.
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow p-5 border-l-4 ${
                  item.is_read
                    ? "border-green-500"
                    : "border-blue-600"
                }`}
              >
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {item.title}
                    </h2>

                    <p className="text-gray-800 dark:text-white mt-2 whitespace-pre-wrap">
                      {item.message}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {item.type}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          item.is_read
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.is_read ? "Read" : "Unread"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right mt-4 md:mt-0">
                    <p className="text-sm text-gray-500">
                      {new Date(
                        item.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  {!item.is_read && (
                    <button
                      onClick={() =>
                        markAsRead(item.id)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;