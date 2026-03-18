import React, { useState } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= REGISTER =================
  const register = async () => {
    try {
      const res = await axios.post(
        "https://diamond-square-api.onrender.com/api/auth/register",
        form
      );

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  // ================= LOGIN =================
  const login = async () => {
    try {
      const res = await axios.post(
        "https://diamond-square-api.onrender.com/api/auth/login",
        {
          phone: form.phone,
          password: form.password,
        }
      );

      alert(res.data.message);

      // SAVE TOKEN
      localStorage.setItem("token", res.data.token);

    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  // ================= GET PROFILE =================
  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://diamond-square-api.onrender.com/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("PROFILE:", res.data);
      alert("Profile fetched successfully");

    } catch (err) {
      alert(err.response?.data?.message || "Error fetching profile");
    }
  };

  // ================= ADMIN =================
  const adminDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://diamond-square-api.onrender.com/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

    } catch (err) {
      alert(err.response?.data?.message || "Access denied");
    }
  };

const createNotice = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "https://diamond-square-api.onrender.com/api/notices",
      {
        title: "Water Supply Issue",
        message: "Water will be off tomorrow from 10 AM",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);

  } catch (err) {
    alert(err.response?.data?.message || "Error creating notice");
  }
};

const getNotices = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "https://diamond-square-api.onrender.com/api/notices",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("NOTICES:", res.data);

  } catch (err) {
    alert(err.response?.data?.message || "Error fetching notices");
  }
};

const createComplaint = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "https://diamond-square-api.onrender.com/api/complaints",
      {
        title: "Lift not working",
        message: "Lift is stuck on 3rd floor",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);

  } catch (err) {
    alert(err.response?.data?.message || "Error creating complaint");
  }
};

const getComplaints = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "https://diamond-square-api.onrender.com/api/complaints",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("COMPLAINTS:", res.data);

  } catch (err) {
    alert(err.response?.data?.message || "Error fetching complaints");
  }
};

const resolveComplaint = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `https://diamond-square-api.onrender.com/api/complaints/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);

  } catch (err) {
    alert(err.response?.data?.message || "Error updating complaint");
  }
};
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Diamond Square Society</h1>

      <input name="name" placeholder="Name" onChange={handleChange} /><br /><br />
      <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
      <input name="phone" placeholder="Phone" onChange={handleChange} /><br /><br />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br /><br />

      <button onClick={register}>Register</button>
      <br /><br />

      <button onClick={login}>Login</button>
      <br /><br />

      <button onClick={getProfile}>Get Profile</button>
      <br /><br />

<br /><br />
<button onClick={createNotice}>Create Notice (Admin)</button>

<br /><br />
<button onClick={getNotices}>Get Notices</button>

<br /><br />
<button onClick={createComplaint}>Create Complaint</button>

<br /><br />
<button onClick={getComplaints}>Get Complaints (Admin)</button>
      {/* ✅ FIXED POSITION */}
      <button onClick={adminDashboard}>Admin Dashboard</button>
    </div>

  );
}

export default App;