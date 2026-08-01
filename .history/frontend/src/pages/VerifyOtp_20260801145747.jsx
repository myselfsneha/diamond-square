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
    if (!phone) {
      return toast.error("Phone number not found. Please login again.");
    }

    if (otp.length !== 6) {
      return toast.error("Enter a valid 6-digit OTP.");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-otp", {
        phone,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );
      localStorage.setItem(
        "role",
        res.data.user.role
      );

      toast.success("Email verified successfully.");

      navigate(
        res.data.user.role === "admin"
          ? "/admin-dashboard"
          : "/dashboard"
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-3">
          Verify Email OTP
        </h1>

        <p className="text-center text-gray-600 mb-2">
          We have sent a 6-digit OTP to your registered email.
        </p>

        <p className="text-center text-blue-600 font-medium mb-6">
          Mobile: {phone}
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, ""))
          }
          placeholder="Enter 6-digit OTP"
          className="w-full border rounded-xl px-4 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={verifyOTP}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Didn't receive the OTP? Try logging in again to receive a new one.
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;