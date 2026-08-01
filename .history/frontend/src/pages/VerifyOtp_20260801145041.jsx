import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const phone =
    location.state?.phone || location.state?.mobile || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      return toast.error("Enter a valid 6-digit OTP.");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-otp-code", {
        phone,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);

      toast.success("Email verified successfully.");

      navigate(
        res.data.user.role === "admin"
          ? "/admin-dashboard"
          : "/dashboard"
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-3">
          Verify Email OTP
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Enter the OTP sent to your registered email address.
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          className="w-full border rounded-xl px-4 py-3 mb-5"
        />

        <button
          onClick={verifyOTP}
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-xl py-3"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}

export default VerifyOtp;