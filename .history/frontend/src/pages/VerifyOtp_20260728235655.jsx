import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "../firebase";
import api from "../services/api";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone || "";

  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const fullPhone = "+91" + phone;

  const sendOTP = async () => {
    try {
      setSending(true);

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
          }
        );
      }

      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        window.recaptchaVerifier
      );

      setConfirmationResult(result);

      toast.success("OTP sent successfully.");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  const verifyOTP = async () => {
    if (!confirmationResult) {
      return toast.error("Send OTP first.");
    }

    if (otp.length !== 6) {
      return toast.error("Enter a valid OTP.");
    }

    try {
      setVerifying(true);

      await confirmationResult.confirm(otp);

      const res = await api.post("/auth/verify-otp", {
        phone,
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

      toast.success("Mobile verified successfully.");

      navigate(
        res.data.user.role === "admin"
          ? "/admin-dashboard"
          : "/dashboard"
      );
    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Verify Mobile Number
        </h1>

        <p className="text-center text-gray-500 mb-6">
          OTP will be sent to {phone}
        </p>

        <div id="recaptcha-container"></div>

        <button
          onClick={sendOTP}
          disabled={sending}
          className="w-full bg-blue-600 text-white rounded-xl py-3 mb-5"
        >
          {sending ? "Sending..." : "Send OTP"}
        </button>

        <input
          type="text"
          placeholder="Enter 6 digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-5"
        />

        <button
          onClick={verifyOTP}
          disabled={verifying}
          className="w-full bg-green-600 text-white rounded-xl py-3"
        >
          {verifying ? "Verifying..." : "Verify OTP"}
        </button>

      </div>

    </div>
  );
}

export default VerifyOtp;