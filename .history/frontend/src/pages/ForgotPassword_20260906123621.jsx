import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LockKeyhole,
  Mail,
  KeyRound,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your registered email.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", {
        email,
      });

      setOtpSent(true);

      toast.success("OTP sent to your registered email.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      toast.success("Password reset successfully.");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 via-indigo-200 to-blue-300 dark:from-slate-950 dark:via-gray-900 dark:to-black px-5">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >

        <div className="backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border border-white/20 p-8">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl mb-6">
            {otpSent ? (
              <KeyRound size={36} />
            ) : (
              <LockKeyhole size={36} />
            )}
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
            Forgot Password
          </h1>

          <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
            Enter your registered email to receive a verification OTP.
          </p>
          