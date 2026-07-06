import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminApprovals() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await api.get("/admin/pending-users");

      setUsers(
        Array.isArray(res.data.users)
          ? res.data.users
          : []
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    try {
      const res = await api.put(
        `/admin/approve-user/${id}`
      );

      if (res.data.success) {
        setUsers((prev) =>
          prev.filter((user) => user.id !== id)
        );

        toast.success(res.data.message);
      } else {
        toast.error("Failed to approve user");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to approve user"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Pending User Approvals
        </h1>

        {loading ? (
          <div className="bg-white p-5 rounded-xl shadow">
            Loading...
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white p-5 rounded-xl shadow">
            No pending users.
          </div>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white p-5 rounded-xl shadow"
              >
                <h2 className="text-xl font-semibold">
                  {user.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  Email: {user.email}
                </p>

                <p className="text-gray-600">
                  Phone: {user.phone}
                </p>

                <p className="text-gray-600">
                  Flat: {user.flat_number || "N/A"}
                </p>

                <p className="text-orange-600 font-medium mt-2">
                  Status: {user.approval_status}
                </p>

                <button
                  onClick={() => approveUser(user.id)}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Approve User
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminApprovals;