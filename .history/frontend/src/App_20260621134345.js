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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;