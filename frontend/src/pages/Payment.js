import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function Payment() {
  const [amount, setAmount] = useState("");

  const pay = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      `${API}/api/payments`,
      { amount },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert("Payment submitted");
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Pay Maintenance</h1>

      <input
        type="number"
        placeholder="Enter amount"
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 mb-4"
      />

      <button
        onClick={pay}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Pay
      </button>
    </Layout>
  );
}

export default Payment;