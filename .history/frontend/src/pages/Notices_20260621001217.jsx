import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Notices() {
  const [notices, setNotices] = useState([]);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Notice Board
        </h1>

        {notices.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-5">
            No notices found.
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-xl shadow p-5 mb-4"
            >
              <h3 className="text-xl font-semibold mb-2">
                {notice.title}
              </h3>

              <p className="text-gray-700 mb-2">
                {notice.description}
              </p>

              <p className="text-sm text-gray-500">
                By: {notice.created_by}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notices;