import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Notices from "./pages/Notices";
import Complaints from "./pages/Complaints";
import Maintenance from "./pages/Maintenance";
import Contacts from "./pages/Contacts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;