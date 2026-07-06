import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Maintenance() {
  const [maintenance, setMaintenance] = useState([]);

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const res = await api.get("/maintenance");
      setMaintenance(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Maintenance Records
        </h1>

        {maintenance.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            No maintenance records found.
          </div>
        ) : (
          maintenance.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-5 mb-4"
            >
              <h3 className="text-xl font-semibold mb-2">
                {item.month}
              </h3>

              <p className="text-gray-700">
                Amount: ₹{item.amount}
              </p>

              <p
                className={`font-semibold mt-2 ${
                  item.status === "Paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Status: {item.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Maintenance;