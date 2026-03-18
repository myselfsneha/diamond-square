import React, { useState } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [notices, setNotices] = useState([]);
  const [bills, setBills] = useState([]);

  const API = "https://diamond-square-api.onrender.com";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= REGISTER =================
  const register = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/register`, form);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  // ================= LOGIN =================
  const login = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        phone: form.phone,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login successful");

    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  // ================= GET NOTICES =================
  const getNotices = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/notices`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotices(res.data);

    } catch (err) {
      alert("Error fetching notices");
    }
  };

  // ================= CREATE NOTICE =================
  const createNotice = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/api/notices`,
        {
          title: "Meeting",
          message: "Society meeting at 6 PM",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Notice created");

    } catch (err) {
      alert("Error creating notice");
    }
  };

  // ================= GET BILLS =================
  const getBills = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/maintenance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBills(res.data);

    } catch (err) {
      alert("Error fetching bills");
    }
  };

  // ================= PAY BILL =================
  const payBill = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API}/api/maintenance/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Payment successful");
      getBills(); // refresh

    } catch (err) {
      alert("Payment failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🏢 Diamond Square Society</h1>

      {/* AUTH */}
      <input name="name" placeholder="Name" onChange={handleChange} /><br />
      <input name="email" placeholder="Email" onChange={handleChange} /><br />
      <input name="phone" placeholder="Phone" onChange={handleChange} /><br />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />

      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>

      <hr />

      {/* NOTICES */}
      <h2>📢 Notices</h2>
      <button onClick={createNotice}>Create Notice</button>
      <button onClick={getNotices}>Load Notices</button>

      {notices.map((n, i) => (
        <div key={i} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h3>{n.title}</h3>
          <p>{n.message}</p>
        </div>
      ))}

      <hr />

      {/* MAINTENANCE */}
      <h2>💳 Maintenance Bills</h2>
      <button onClick={getBills}>Load Bills</button>

      {bills.map((b) => (
        <div key={b._id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <p>Month: {b.month}</p>
          <p>Amount: ₹{b.amount}</p>
          <p>Status: {b.status}</p>

          {b.status === "unpaid" && (
            <button onClick={() => payBill(b._id)}>Pay</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;