import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "notice":
        return "bg-blue-100 text-blue-700";
      case "complaint":
        return "bg-red-100 text-red-700";
      case "payment":
        return "bg-yellow-100 text-yellow-700";
      case "event":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-6">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Notifications
        </h1>

        <div className="grid gap-4">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-5">
              No notifications available.
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white rounded-xl shadow p-5"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">
                    {notification.title}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(
                      notification.type
                    )}`}
                  >
                    {notification.type}
                  </span>
                </div>

                <p className="text-gray-700">
                  {notification.message}
                </p>

                <p className="text-sm text-gray-500 mt-3">
                  {new Date(
                    notification.created_at
                  ).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;