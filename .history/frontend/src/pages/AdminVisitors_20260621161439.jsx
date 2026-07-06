import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await api.get("/visitors");
      setVisitors(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addVisitor = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/visitors", {
        name,
        phone,
        purpose,
      });

      setVisitors([res.data, ...visitors]);

      setName("");
      setPhone("");
      setPurpose("");

      alert("Visitor added successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to add visitor");
    }
  };

  const deleteVisitor = async (id) => {
    if (!window.confirm("Delete this visitor record?")) return;

    try {
      await api.delete(`/visitors/${id}`);

      setVisitors(
        visitors.filter((visitor) => visitor.id !== id)
      );

      alert("Visitor deleted");
    } catch (error) {
      console.log(error);
      alert("Failed to delete visitor");
    }
  };

  const filteredVisitors = visitors.filter((visitor) =>
    `${visitor.name || ""} ${visitor.phone || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Admin Visitors Management
        </h1>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <form onSubmit={addVisitor}>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Visitor Name"
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

              <input
                type="text"
                placeholder="Purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="border rounded-lg px-4 py-2"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Visitor
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search visitors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="grid gap-4">
          {filteredVisitors.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-5">
              No visitors found.
            </div>
          ) : (
            filteredVisitors.map((visitor) => (
              <div
                key={visitor.id}
                className="bg-white rounded-xl shadow p-5"
              >
                <h2 className="text-xl font-semibold">
                  {visitor.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  Phone: {visitor.phone}
                </p>

                <p className="text-gray-600">
                  Purpose: {visitor.purpose}
                </p>

                <p className="text-gray-600">
                  Entry Time: {visitor.entry_time || "N/A"}
                </p>

                <button
                  onClick={() => deleteVisitor(visitor.id)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete Visitor
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminVisitors;