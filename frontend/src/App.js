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

  const register = async () => {
    try {
      const res = await axios.post(
        "https://diamond-square-api.onrender.com/api/auth/register",
        form
      );

      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Registration Failed");
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
    </div>
  );
}

export default App;