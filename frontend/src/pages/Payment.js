import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function Payment() {
  const token = localStorage.getItem("token");

  const pay = async () => {
    const res = await axios.post(
      `${API}/api/payments/create-order`,
      { amount: 500 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const options = {
      key: "rzp_test_ST4YZIwuNUdPpX",
      amount: res.data.amount,
      currency: "INR",
      name: "Diamond Square",
      order_id: res.data.id,
      handler: async function () {
        await axios.post(
          `${API}/api/payments`,
          { amount: 500 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Payment success");
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Layout>
      <h1>Payment</h1>
      <button onClick={pay}>Pay ₹500</button>
    </Layout>
  );
}

export default Payment;