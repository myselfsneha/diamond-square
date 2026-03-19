import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function Complaint() {
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const submit = async () => {
    await axios.post(`${API}/api/complaints`, 
      { message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Complaint sent");
  };

  return (
    <Layout>
      <h1>Raise Complaint</h1>

      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Enter complaint"
      />

      <button onClick={submit}>Submit</button>
    </Layout>
  );
}

export default Complaint;