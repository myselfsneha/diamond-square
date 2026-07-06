import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminGuards() {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    shift: "Morning",
  });

  useEffect(() => {
    fetchGuards();

    const interval = setInterval(() => {
      fetchGuards();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchGuards = async () => {
    try {
      setLoading(true);

      const res = await api.get("/guards");

      setGuards(res.data || []);
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

  const saveGuard = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/guards/${editingId}`, form);

        setGuards((prev) =>
          prev.map((guard) =>
            guard.id === editingId
              ? { ...guard, ...form }
              : guard
          )
        );

        alert("Guard updated successfully");
      } else {
        const res = await api.post("/guards", form);

        setGuards((prev) => [...prev, res.data]);

        alert("Guard added successfully");
      }

      resetForm();
    } catch (error) {
      console.log(error);
      alert("Failed to save guard");
    }
  };

  const editGuard = (guard) => {
    setEditingId(guard.id);

    setForm({
      name: guard.name,
      phone: guard.phone,
      shift: guard.shift,
    });
  };
        <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">
              Admin Guards Management
            </h1>

            <button
              onClick={fetchGuards}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
              Refresh
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <form onSubmit={addGuard}>
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Guard Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                  required
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                  required
                />

                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                  required
                >
                  <option value="">Select Shift</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                Add Guard
              </button>
            </form>
          </div>

          <p className="text-gray-600 mb-4">
            Total Guards: {guards.length}
          </p>

          <div className="grid gap-4">
            {guards.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-5 text-center">
                No guards found.
              </div>
            ) : (
                            guards.map((guard) => (
                <div
                  key={guard.id}
                  className="bg-white rounded-xl shadow p-5 flex flex-col md:flex-row md:justify-between md:items-center"
                >
                  <div>
                    <h2 className="text-xl font-semibold">
                      {guard.name}
                    </h2>

                    <p className="text-gray-600 mt-2">
                      📞 {guard.phone}
                    </p>

                    <p className="text-gray-600">
                      🕒 Shift: {guard.shift}
                    </p>

                    {guard.created_at && (
                      <p className="text-sm text-gray-400 mt-2">
                        Added:{" "}
                        {new Date(
                          guard.created_at
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteGuard(guard.id)}
                    className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
}

export default AdminGuards;