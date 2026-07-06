import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Notices() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();

    const interval = setInterval(() => {
      fetchNotices();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get("/notices");

      const sorted = [...(res.data || [])].sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );

      setNotices(sorted);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Notice Board
        </h1>

        <p className="text-gray-800 dark:text-white mb-6">
          Total Notices: {notices.length}
        </p>

        {notices.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            No notices found.
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-xl shadow p-5 mb-4"
            >
              <h3 className="text-xl font-semibold mb-3">
                {notice.title}
              </h3>

              <p className="text-gray-700 mb-4">
                {notice.description}
              </p>

              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  Posted By:{" "}
                  {notice.created_by || "Admin"}
                </p>

                <p>
                  Date:{" "}
                  {notice.created_at
                    ? new Date(
                        notice.created_at
                      ).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notices;