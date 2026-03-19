import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Complaint from "./pages/Complaint";
import AdminComplaints from "./pages/AdminComplaints";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/complaint" element={<Complaint />} />
<Route path="/admin/complaints" element={<AdminComplaints />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;