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

  // REGISTER
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

  // LOGIN
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

  // GET PROFILE
  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

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
      console.error(err);
      alert(err.response?.data?.message || "Error fetching profile");
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
    </div>
  );
}

export default App;