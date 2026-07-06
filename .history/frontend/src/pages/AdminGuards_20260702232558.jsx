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

    const interval = setInterval(fetchGuards, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchGuards = async () => {
    try {
      setLoading(true);

      const res = await api.get("/guards");

      setGuards(
        Array.isArray(res.data.guards)
          ? res.data.guards
          : []
      );
    } catch (error) {
      console.log(error);
      setGuards([]);
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

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      phone: "",
      shift: "Morning",
    });
  };

  const saveGuard = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/guards/${editingId}`, form);
        alert("Guard updated successfully");
      } else {
        await api.post("/guards", form);
        alert("Guard added successfully");
      }

      resetForm();
      fetchGuards();
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteGuard = async (id) => {
    if (!window.confirm("Delete this guard?")) return;

    try {
      await api.delete(`/guards/${id}`);

      setGuards((prev) =>
        prev.filter((guard) => guard.id !== id)
      );

      alert("Guard deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete guard");
    }
  };

  const filteredGuards = useMemo(() => {
    if (!Array.isArray(guards)) return [];

    return guards.filter((guard) =>
      `${guard.name || ""} ${guard.phone || ""} ${guard.shift || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [guards, search]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
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
          <form onSubmit={saveGuard}>
            <div className="grid md:grid-cols-3 gap-4">

              <input
                type="text"
                name="name"
                placeholder="Guard Name"
                value={form.name}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
                required
              />

              <select
                name="shift"
                value={form.shift}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2"
                required
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>

            </div>

            <div className="flex gap-3 mt-4">
                            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                {editingId ? "Update Guard" : "Add Guard"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <input
            type="text"
            placeholder="Search guards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>

        <p className="text-gray-600 mb-4">
          Total Guards: {filteredGuards.length}
        </p>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            Loading...
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredGuards.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-5 text-center">
                No guards found.
              </div>
            ) : (
              filteredGuards.map((guard) => (
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
                        Added{" "}
                        {new Date(
                          guard.created_at
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                      onClick={() => editGuard(guard)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteGuard(guard.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminGuards;