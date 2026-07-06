import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/maintenance");
      setPayments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const markAsPaid = async (id) => {
    try {
      await api.put(`/maintenance/${id}/paid`);

      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === id
            ? { ...payment, status: "paid" }
            : payment
        )
      );

      alert("Payment marked as paid");
    } catch (error) {
      console.log(error);
      alert("Failed to update payment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Admin Payments Management
        </h1>

        <div className="grid gap-4">
          {payments.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-5">
              No payment records found.
            </div>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-xl shadow p-5"
              >
                <h2 className="text-xl font-semibold">
                  {payment.name || "Resident"}
                </h2>

                <p className="text-gray-600 mt-2">
                  Amount: ₹{payment.amount}
                </p>

                <p className="text-gray-600">
                  Due Date: {payment.due_date}
                </p>

                <p
                  className={`font-semibold mt-2 ${
                    payment.status === "paid"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Status: {payment.status}
                </p>

                {payment.status !== "paid" && (
                  <button
                    onClick={() => markAsPaid(payment.id)}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPayments;