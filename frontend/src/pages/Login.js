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
    <div className="p-10 text-center">
      <input placeholder="Phone" onChange={e => setForm({...form, phone:e.target.value})}/>
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password:e.target.value})}/>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;