import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API;

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ phone: "", password: "" });

  const login = async () => {
    const res = await axios.post(`${API}/api/auth/login`, form);

    localStorage.setItem("token", res.data.token);

    if (res.data.user.role === "admin") navigate("/admin");
    else navigate("/dashboard");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          className="w-full border p-2 mb-4 rounded"
          placeholder="Phone"
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />

        <input
          type="password"
          className="w-full border p-2 mb-4 rounded"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>

    </div>
  );
}

export default Login;