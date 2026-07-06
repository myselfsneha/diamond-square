import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";

function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-5">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center">

          <div className="mx-auto w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white mb-5">
            <LockKeyhole size={36} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Forgot Password
          </h1>

          <p className="mt-3 text-gray-500">
            SMS OTP password reset will be available in Version 1.1.
          </p>

          <Link
            to="/"
            className="mt-8 inline-block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
          >
            Back to Login
          </Link>

        </div>

      </motion.div>

    </div>
  );
}

export default ForgotPassword;