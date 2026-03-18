import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async () => {
    try {
      const res = await axios.post(
        "https://diamond-square-api.onrender.com/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);

      // ROLE BASED NAVIGATION
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4 font-bold">Login</h2>

        <input
          className="w-full border p-2 mb-2"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
        />

        <input
          className="w-full border p-2 mb-2"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button
          className="bg-blue-500 text-white w-full py-2 rounded"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;