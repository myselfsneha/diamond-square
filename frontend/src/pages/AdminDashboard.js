import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API;

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");

  const getUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div>
      <h1>Admin Panel</h1>

      {users.map(u => (
        <div key={u._id}>
          {u.name} - {u.phone}
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;