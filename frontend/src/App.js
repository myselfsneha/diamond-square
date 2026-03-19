import { BrowserRouter, Routes, Route } from "react-router-dom";
import Complaint from "./Complaint";
import My from "./pages/MyComplaints";
import Admin from "./pages/AdminComplaints";
import Payment from "./pages/Payment";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Complaint />} />
        <Route path="/my" element={<My />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/pay" element={<Payment />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;