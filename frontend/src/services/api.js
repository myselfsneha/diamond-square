import axios from "axios";
import { toast } from "react-toastify";

/*
|--------------------------------------------------------------------------
| API Base URL
|--------------------------------------------------------------------------
| Production:
| VITE_API_URL=https://your-domain.com/api
|
| Development:
| http://localhost:5000/api
|--------------------------------------------------------------------------
*/

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["X-App-Version"] = "1.0";

    return config;
  },
  (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;

    switch (status) {
      case 400:
        toast.error(
          error.response?.data?.message ||
            "Invalid request."
        );
        break;

      case 401:
        toast.error("Session expired. Please login again.");

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        if (window.location.pathname !== "/") {
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        }
        break;

      case 403:
        toast.error(
          error.response?.data?.message ||
            "Access denied."
        );
        break;

      case 404:
        toast.error(
          error.response?.data?.message ||
            "Resource not found."
        );
        break;

      case 409:
        toast.warning(
          error.response?.data?.message ||
            "Conflict detected."
        );
        break;

      case 422:
        toast.warning(
          error.response?.data?.message ||
            "Validation failed."
        );
        break;

      case 429:
        toast.warning(
          "Too many requests. Please wait."
        );
        break;

      case 500:
        toast.error(
          "Server error. Please try again later."
        );
        break;

      default:
        if (!error.response) {
          toast.error(
            "Unable to connect to server."
          );
        }
    }

    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| Authentication Helpers
|--------------------------------------------------------------------------
*/

export const auth = {
  getToken: () => localStorage.getItem("token"),

  getUser: () => {
    try {
      return JSON.parse(
        localStorage.getItem("user")
      );
    } catch {
      return null;
    }
  },

  getRole: () => localStorage.getItem("role"),

  isLoggedIn: () => !!localStorage.getItem("token"),

  login(data) {
    localStorage.setItem("token", data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "role",
      data.user?.role || "resident"
    );
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  },
};

/*
|--------------------------------------------------------------------------
| Authentication APIs
|--------------------------------------------------------------------------
*/

export const login = (data) =>
  api.post("/auth/login", data);

export const register = (data) =>
  api.post("/auth/register", data);

export const forgotPassword = (phone) =>
  api.post("/auth/forgot-password", {
    phone,
  });

export const verifyOTP = (data) =>
  api.post("/auth/verify-otp", data);

export const resetPassword = (data) =>
  api.post("/auth/reset-password", data);

export const googleLogin = (data) =>
  api.post("/auth/google-login", data);

export default api;