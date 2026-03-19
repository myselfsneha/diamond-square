import { BrowserRouter, Routes, Route } from "react-router-dom";
import Complaint from "./pages/Complaint";
import MyComplaints from "./pages/MyComplaints";
import AdminComplaints from "./pages/AdminComplaints";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;