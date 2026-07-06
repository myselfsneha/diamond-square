import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone || "";

  useEffect(() => {
    if (!phone) {
      toast.error("Registration session expired.");
      navigate("/register");
      return;
    }

    const configuration = {
      widgetId: import.meta.env.VITE_MSG91_WIDGET_ID,
      tokenAuth: import.meta.env.VITE_MSG91_TOKEN_AUTH,
      identifier: phone,
      exposeMethods: true,

      success: async (data) => {
        console.log("MSG91 Success:", data);

        try {
          const res = await api.post("/auth/verify-otp", {
            phone,
            accessToken:
              data.accessToken ||
              data.access_token ||
              data.token,
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

          toast.success("Account verified successfully!");

          navigate(
            res.data.user.role === "admin"
              ? "/admin-dashboard"
              : "/dashboard"
          );
        } catch (error) {
          console.error(error);

          toast.error(
            error.response?.data?.message ||
              "OTP verification failed."
          );
        }
      },

      failure: (error) => {
        console.log("MSG91 Error:", error);
        toast.error("OTP verification failed.");
      },
    };

    const script = document.createElement("script");
    script.src = "https://verify.msg91.com/otp-provider.js";
    script.async = true;

    script.onload = () => {
      if (window.initSendOTP) {
        window.initSendOTP(configuration);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [phone, navigate]);

  const openOTP = () => {
    if (window.sendOTP) {
      window.sendOTP();
    } else {
      toast.error("OTP widget not loaded.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-3">
          Verify Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Verify your mobile number using OTP.
        </p>

        <button
          onClick={openOTP}
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          Verify Mobile Number
        </button>

      </div>
    </div>
  );
}

export default VerifyOtp;