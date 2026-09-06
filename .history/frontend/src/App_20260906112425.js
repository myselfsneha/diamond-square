// src/App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Polls from "./pages/Polls";
import Profile from "./pages/Profile";
import Notices from "./pages/Notices";
import Complaints from "./pages/Complaints";
import Maintenance from "./pages/Maintenance";
import Contacts from "./pages/Contacts";
import CreateComplaint from "./pages/CreateComplaint";
import ChangePassword from "./pages/ChangePassword";
import Settings from "./pages/Settings";
import EditProfile from "./pages/EditProfile";
import Documents from "./pages/Documents";

import AdminComplaints from "./pages/AdminComplaints";
import AdminNotices from "./pages/AdminNotices";
import AdminMaintenance from "./pages/AdminMaintenance";
import AdminResidents from "./pages/AdminResidents";
import AdminApprovals from "./pages/AdminApprovals";
import AdminContacts from "./pages/AdminContacts";
import AdminEvents from "./pages/AdminEvents";
import AdminPayments from "./pages/AdminPayments";
import AdminVisitors from "./pages/AdminVisitors";
import AdminGuards from "./pages/AdminGuards";
import AdminDocuments from "./pages/AdminDocuments";
import AdminPolls from "./pages/AdminPolls";
import AdminSettings from "./pages/AdminSettings";
import AdminReports from "./pages/AdminReports";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">

        <BrowserRouter>

          <Routes>

            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notices"
              element={
                <ProtectedRoute>
                  <Notices />
                </ProtectedRoute>
              }
            />

            