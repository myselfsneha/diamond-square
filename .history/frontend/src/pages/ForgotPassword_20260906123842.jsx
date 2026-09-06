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
                    {!otpSent ? (
            <form onSubmit={handleSendOTP} className="mt-8 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Registered Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@example.com"
                    className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Send Email OTP"
                )}
              </button>

            </form>
          ) : (
            <form
              onSubmit={handleResetPassword}
              className="mt-8 space-y-5"
            >

              <div className="rounded-2xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 p-4 text-center">

                <CheckCircle
                  size={40}
                  className="mx-auto text-green-600 mb-2"
                />

                <p className="text-sm text-gray-700 dark:text-gray-300">
                  OTP has been sent to your registered email.
                </p>

              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Verification OTP
                </label>

                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full rounded-xl border border-gray-300 py-3 px-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              