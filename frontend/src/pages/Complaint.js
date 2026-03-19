import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function Complaint() {
  const [message, setMessage] = useState("");

  const submitComplaint = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      `${API}/api/complaints`,
      { message },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert("Complaint submitted");
    setMessage("");
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Raise Complaint</h1>

      <textarea
        className="w-full border p-3 rounded mb-4"
        placeholder="Enter your issue..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={submitComplaint}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </Layout>
  );
}

export default Complaint;