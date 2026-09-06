import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LockKeyhole,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <div className="rounded-3xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border border-white/20 p-10 text-center">

          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
            <LockKeyhole size={42} />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Forgot Password
          </h1>

          <p className="mt-4 text-gray-600 dark:text-gray-400 leading-7">
            Password recovery using
            <span className="font-semibold text-blue-600">
              {" "}SMS OTP{" "}
            </span>
            will be available in
            <span className="font-semibold">
              {" "}Version 1.1
            </span>.
          </p>

          <div className="mt-8 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-5 flex items-start gap-4 text-left">
            <ShieldCheck className="text-blue-600 shrink-0 mt-1" size={24} />

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Coming Soon
              </h3>

              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Secure OTP verification and password reset will be added in the next update.
              </p>
            </div>
          </div>