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

      // ✅ SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      console.log("TOKEN:", res.data.token);
      console.log("USER:", res.data.user);

    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
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
    </div>
  );
}

export default App;