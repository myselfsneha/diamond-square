import { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API;

export default function Complaint() {
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");

  return (
    <>
      <input onChange={e => setMsg(e.target.value)} />
      <button onClick={async () => {
        await axios.post(`${API}/api/complaints`,
          { message: msg },
          { headers: { Authorization: `Bearer ${token}` } });
      }}>
        Send
      </button>
    </>
  );
}