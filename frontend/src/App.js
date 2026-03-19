import { BrowserRouter, Routes, Route } from "react-router-dom";
import Complaint from "./pages/Complaint";
import MyComplaints from "./pages/MyComplaints";
import AdminComplaints from "./pages/AdminComplaints";
import Payment from "./pages/Payment";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Complaint />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;