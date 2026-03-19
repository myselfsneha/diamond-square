const mongoose = require("mongoose");

const pay = async () => {
  const token = localStorage.getItem("token");

  const { data } = await axios.post(
    `${API}/api/payments/create-order`,
    { amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const options = {
    key: "YOUR_RAZORPAY_KEY",
    amount: data.amount,
    currency: data.currency,
    order_id: data.id,
    handler: function (response) {
      alert("Payment Successful 🎉");
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

module.exports = mongoose.model("Payment", paymentSchema);