import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Notices from "./pages/Notices";
import Complaints from "./pages/Complaints";
import CreateComplaint from "./pages/CreateComplaint";
import Maintenance from "./pages/Maintenance";
import Contacts from "./pages/Contacts";

import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";
import AdminNotices from "./pages/AdminNotices";
import AdminMaintenance from "./pages/AdminMaintenance";
import AdminResidents from "./pages/AdminResidents";
import AdminApprovals from "./pages/AdminApprovals";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Resident Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route
          path="/create-complaint"
          element={<CreateComplaint />}
        />
        <Route
          path="/maintenance"
          element={<Maintenance />}
        />
        <Route path="/contacts" element={<Contacts />} />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin-complaints"
          element={<AdminComplaints />}
        />
        <Route
          path="/admin-notices"
          element={<AdminNotices />}
        />
        <Route
          path="/admin-maintenance"
          element={<AdminMaintenance />}
        />
        <Route
          path="/admin-residents"
          element={<AdminResidents />}
        />
        <Route
          path="/admin-approvals"
          element={<AdminApprovals />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;