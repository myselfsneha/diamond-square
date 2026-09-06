import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["X-App-Version"] = "2.0";
    config.headers["X-Requested-With"] = "XMLHttpRequest";

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error;

    switch (status) {
      case 400:
        toast.error(message || "Invalid request.");
        break;

      case 401:
        if (!isRefreshing) {
          isRefreshing = true;

          toast.error("Session expired. Please login again.");

          localStorage.clear();
          sessionStorage.clear();

          setTimeout(() => {
            window.location.href = "/";
            isRefreshing = false;
          }, 800);
        }
        break;

      case 403:
        toast.error(message || "Access denied.");
        break;

      case 404:
        toast.error(message || "Resource not found.");
        break;

      case 409:
        toast.warning(message || "Conflict detected.");
        break;

      case 422:
        toast.warning(message || "Validation failed.");
        break;

      case 429:
        toast.warning(
          "Too many requests. Please try again shortly."
        );
        break;

      case 500:
        toast.error("Internal server error.");
        break;

      case 502:
      case 503:
      case 504:
        toast.error("Server temporarily unavailable.");
        break;

      default:
        if (!error.response) {
          toast.error(
            "Unable to connect. Check your internet connection."
          );
        }
    }

    return Promise.reject(error);
  }
);

export const auth = {
  getToken() {
    return localStorage.getItem("token");
  },

  getUser() {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "{}"
      );
    } catch {
      return null;
    }
  },

  getRole() {
    return localStorage.getItem("role") || "resident";
  },

  isLoggedIn() {
    return !!localStorage.getItem("token");
  },

  login(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );
    localStorage.setItem(
      "role",
      data.user.role || "resident"
    );
  },

  logout() {
    localStorage.clear();
    sessionStorage.clear();
  },
};

export const login = (data) =>
  api.post("/auth/login", data);

export const register = (data) =>
  api.post("/auth/register", data);

export const verifyOTP = (data) =>
  api.post("/auth/verify-otp", data);

export const verifyOTPCode = (data) =>
  api.post("/auth/verify-otp-code", data);

export const resendOTP = (data) =>
  api.post("/auth/resend-otp", data);

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", {
    email,
  });

export const resetPassword = (data) =>
  api.post("/auth/reset-password", data);

export const changePassword = (data) =>
  api.post("/auth/change-password", data);

export const getProfile = () =>
  api.get("/users/profile");

export const updateProfile = (data) =>
  api.put("/users/profile", data);

export const uploadProfileImage = (formData) =>
  api.post("/users/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getNotifications = () =>
  api.get("/notifications");

export const markNotificationRead = (id) =>
  api.put(`/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
  api.put("/notifications/read-all");

export const getDashboard = () =>
  api.get("/dashboard");

export default api;