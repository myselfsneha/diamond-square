import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function Payment() {
  const [amount, setAmount] = useState("");

  const pay = async () => {
    const token = localStorage.getItem("token");

    const { data } = await axios.post(
      `${API}/api/payments/create-order`,
      { amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const options = {
      key: "rzp_test_123456",
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,
      handler: async () => {
        await axios.post(`${API}/api/payments`,
          { amount },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Payment Success 🎉");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Layout>
      <input type="number" onChange={(e) => setAmount(e.target.value)} />
      <button onClick={pay}>Pay</button>
    </Layout>
  );
}

export default Payment;