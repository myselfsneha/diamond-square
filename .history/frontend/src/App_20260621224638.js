// src/App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Resident Pages
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Polls from "./pages/Polls";

// Admin Pages
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

        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Resident */}
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

        {/* Admin */}
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;