import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminMaintenance() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    month: "",
    amount: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await api.get("/maintenance");
      setRecords(res.data);
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

  const createRecord = async (e) => {
    e.preventDefault();

    try {
      await api.post("/maintenance", form);

      setForm({
        month: "",
        amount: "",
        status: "Pending",
      });

      fetchRecords();

      alert("Maintenance record added successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to add maintenance record");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/maintenance/${id}`, { status });

      setRecords((prev) =>
        prev.map((record) =>
          record.id === id ? { ...record, status } : record
        )
      );
    } catch (error) {
      console.log(error);
      alert("Failed to update status");
    }
  };

  const deleteRecord = async (id) => {
    try {
      await api.delete(`/maintenance/${id}`);

      setRecords((prev) =>
        prev.filter((record) => record.id !== id)
      );
    } catch (error) {
      console.log(error);
      alert("Failed to delete record");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Manage Maintenance
        </h1>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Add Maintenance Record
          </h2>

          <form onSubmit={createRecord}>
            <input
              type="text"
              name="month"
              placeholder="Month (e.g. June 2026)"
              value={form.month}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 mb-4"
              required
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 mb-4"
              required
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 mb-4"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Record
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow p-5"
            >
              <h3 className="text-xl font-semibold">
                {record.month}
              </h3>

              <p className="mt-2">
                Amount: ₹{record.amount}
              </p>

              <p
                className={`mt-2 font-semibold ${
                  record.status === "Paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Status: {record.status}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    updateStatus(record.id, "Paid")
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Mark Paid
                </button>

                <button
                  onClick={() =>
                    updateStatus(record.id, "Pending")
                  }
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                >
                  Mark Pending
                </button>

                <button
                  onClick={() => deleteRecord(record.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminMaintenance;