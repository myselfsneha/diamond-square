import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function Complaint() {
  const [message, setMessage] = useState("");

  const submit = async () => {
    const token = localStorage.getItem("token");

    await axios.post(`${API}/api/complaints`,
      { message },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Submitted");
  };

  return (
    <Layout>
      <textarea onChange={(e) => setMessage(e.target.value)} />
      <button onClick={submit}>Submit</button>
    </Layout>
  );
}

export default Complaint;