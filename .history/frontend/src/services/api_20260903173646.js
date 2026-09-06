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

let redirecting = false;

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
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      "Something went wrong.";

    switch (status) {
      case 400:
        toast.error(message);
        break;

      case 401:
        if (!redirecting) {
          redirecting = true;

          toast.error("Session expired. Please login again.");

          localStorage.clear();
          sessionStorage.clear();

          setTimeout(() => {
            window.location.href = "/";
            redirecting = false;
          }, 800);
        }
        break;

      case 403:
        toast.warning(message);
        break;

      case 404:
        toast.error(message);
        break;

      case 409:
        toast.warning(message);
        break;

      case 422:
        toast.warning(message);
        break;

      case 429:
        toast.warning("Too many requests.");
        break;

      case 500:
        toast.error("Internal Server Error.");
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

// ======================
// Auth Helpers
// ======================

export const auth = {
  getToken() {
    return localStorage.getItem("token");
  },

  getUser() {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  },

  getRole() {
    return localStorage.getItem("role");
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
      data.user.role
    );
  },

  logout() {
    localStorage.clear();
    sessionStorage.clear();
  },
};

// ======================
// Authentication
// ======================

export const register = (data) =>
  api.post("/auth/register", data);

export const login = (data) =>
  api.post("/auth/login", data);

export const verifyOTP = (data) =>
  api.post("/auth/verify-otp", data);

export const verifyOTPCode = (data) =>
  api.post("/auth/verify-otp-code", data);

export const forgotPassword = (data) =>
  api.post("/auth/forgot-password", data);

export const resetPassword = (data) =>
  api.post("/auth/reset-password", data);

// ======================
// Profile
// ======================

export const getProfile = () =>
  api.get("/auth/profile");

export const updateProfile = (data) =>
  api.put("/auth/profile", data);

export const changePassword = (data) =>
  api.put("/auth/change-password", data);

export const uploadProfileImage = (formData) =>
  api.post(
    "/auth/upload-profile-image",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

// ======================
// Dashboard
// ======================

export const switchDashboard = (data) =>
  api.post("/auth/switch-dashboard", data);

export const logout = () =>
  api.post("/auth/logout");

// ======================
// Default Export
// ======================

export default api;