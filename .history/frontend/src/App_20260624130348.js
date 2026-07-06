// src/App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Resident
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

// Admin
import AdminDashboard from "./pages/AdminDashboard";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Resident Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
          path="/polls"
          element={
            <ProtectedRoute>
              <Polls />
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
          path="/notices"
          element={
            <ProtectedRoute>
              <Notices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <Complaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-complaint"
          element={
            <ProtectedRoute>
              <CreateComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <Maintenance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <Contacts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-complaints"
          element={
            <ProtectedRoute adminOnly>
              <AdminComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-notices"
          element={
            <ProtectedRoute adminOnly>
              <AdminNotices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-maintenance"
          element={
            <ProtectedRoute adminOnly>
              <AdminMaintenance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-residents"
          element={
            <ProtectedRoute adminOnly>
              <AdminResidents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-approvals"
          element={
            <ProtectedRoute adminOnly>
              <AdminApprovals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-contacts"
          element={
            <ProtectedRoute adminOnly>
              <AdminContacts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-events"
          element={
            <ProtectedRoute adminOnly>
              <AdminEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-payments"
          element={
            <ProtectedRoute adminOnly>
              <AdminPayments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-visitors"
          element={
            <ProtectedRoute adminOnly>
              <AdminVisitors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-guards"
          element={
            <ProtectedRoute adminOnly>
              <AdminGuards />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-documents"
          element={
            <ProtectedRoute adminOnly>
              <AdminDocuments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-polls"
          element={
            <ProtectedRoute adminOnly>
              <AdminPolls />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <h1 className="text-3xl font-bold">
                404 - Page Not Found
              </h1>
            </div>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;