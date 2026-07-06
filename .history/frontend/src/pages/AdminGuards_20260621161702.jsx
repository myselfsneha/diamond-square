import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminGuards() {
  const [guards, setGuards] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shift, setShift] = useState("");

  useEffect(() => {
    fetchGuards();
  }, []);

  const fetchGuards = async () => {
    try {
      const res = await api.get("/guards");
      setGuards(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addGuard = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/guards", {
        name,
        phone,
        shift,
      });

      setGuards([...guards, res.data]);

      setName("");
      setPhone("");
      setShift("");

      alert("Guard added successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to add guard");
    }
  };

  const deleteGuard = async (id) => {
    if (!window.confirm("Delete this guard?")) return;

    try {
      await api.delete(`/guards/${id}`);

      setGuards(
        guards.filter((guard) => guard.id !== id)
      );

      alert("Guard deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete guard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Admin Guards Management
        </h1>

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
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Guard
            </button>
          </form>
        </div>

        <div className="grid gap-4">
          {guards.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-5">
              No guards found.
            </div>
          ) : (
            guards.map((guard) => (
              <div
                key={guard.id}
                className="bg-white rounded-xl shadow p-5"
              >
                <h2 className="text-xl font-semibold">
                  {guard.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  Phone: {guard.phone}
                </p>

                <p className="text-gray-600">
                  Shift: {guard.shift}
                </p>

                <button
                  onClick={() => deleteGuard(guard.id)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete Guard
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