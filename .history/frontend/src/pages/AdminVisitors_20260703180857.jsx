// Part 1/4

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

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

    setVisitors(
      Array.isArray(res.data.visitors)
        ? res.data.visitors
        : []
    );
  } catch (error) {
    console.error(error);
    toast.error("Failed to load visitors");
    setVisitors([]);
  } finally {
    setLoading(false);
  }
};

  const addVisitor = async (e) => {
  e.preventDefault();

  try {
    const user = JSON.parse(localStorage.getItem("user"));

    await api.post("/visitors", {
      visitor_name: name,
      phone,
      purpose,
      resident_id: user.id,
    });

    toast.success("Visitor request created");

    setName("");
    setPhone("");
    setPurpose("");

    fetchVisitors();
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message || "Failed to add visitor"
    );
  }
};

  const approveVisitor = async (id) => {
    try {
      await api.put(`/visitors/approve/${id}`);

      setVisitors((prev) =>
        prev.map((visitor) =>
          visitor.id === id
            ? { ...visitor, status: "Approved" }
            : visitor
        )
      );

      toast.success("Visitor approved");
    } catch (error) {
      console.error(error);
      toast.error("Approval failed");
    }
  };

  const markEntry = async (id) => {
    try {
      await api.put(`/visitors/entry/${id}`);

      setVisitors((prev) =>
        prev.map((visitor) =>
          visitor.id === id
            ? {
                ...visitor,
                status: "Entered",
                entry_time: new Date().toLocaleString(),
              }
            : visitor
        )
      );

      toast.success("Visitor entered");
    } catch (error) {
      console.error(error);
      toast.error("Failed");
    }
  };

  const markExit = async (id) => {
    try {
      await api.put(`/visitors/exit/${id}`);

      setVisitors((prev) =>
        prev.map((visitor) =>
          visitor.id === id
            ? {
                ...visitor,
                status: "Exited",
                exit_time: new Date().toLocaleString(),
              }
            : visitor
        )
      );

      toast.success("Visitor exited");
    } catch (error) {
      console.error(error);
      toast.error("Failed");
    }
  };

  const deleteVisitor = async (id) => {
    if (!window.confirm("Delete visitor?")) return;

    try {
      await api.delete(`/visitors/${id}`);

      setVisitors((prev) =>
        prev.filter((visitor) => visitor.id !== id)
      );

      toast.success("Visitor deleted");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const filteredVisitors = visitors.filter((visitor) =>
    `${visitor.name} ${visitor.phone} ${visitor.purpose}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Visitor Management
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">

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
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Add Visitor
            </button>

          </form>

        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6">

          <input
            type="text"
            placeholder="Search visitors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            Loading visitors...
          </div>
        ) : filteredVisitors.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            No visitors found.
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredVisitors.map((visitor) => {
              const status = visitor.status || "Pending";

              return (
                <div
                  key={visitor.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow p-5"
                >
                  <div className="flex justify-between items-center flex-wrap gap-3">

                    <div>
                      <h2 className="text-xl font-semibold">
                        {visitor.name}
                      </h2>

                      <p className="text-gray-800 dark:text-white">
                        📞 {visitor.phone}
                      </p>

                      <p className="text-gray-800 dark:text-white">
                        🎯 {visitor.purpose}
                      </p>

                      <p className="text-gray-800 dark:text-white">
                        Entry: {visitor.entry_time || "Not Entered"}
                      </p>

                      <p className="text-gray-800 dark:text-white">
                        Exit: {visitor.exit_time || "Not Exited"}
                      </p>

                      <div className="mt-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : status === "Approved"
                              ? "bg-blue-100 text-blue-700"
                              : status === "Entered"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">

                      {status === "Pending" && (
                        <button
                          onClick={() => approveVisitor(visitor.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                          Approve
                        </button>
                      )}

                      {status === "Approved" && (
                        <button
                          onClick={() => markEntry(visitor.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                          Mark Entry
                        </button>
                      )}

                      {status === "Entered" && (
                        <button
                          onClick={() => markExit(visitor.id)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
                        >
                          Mark Exit
                        </button>
                      )}

                      <button
                        onClick={() => deleteVisitor(visitor.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
export default AdminVisitors;