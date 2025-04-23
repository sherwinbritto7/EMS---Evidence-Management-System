import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import LawEnforcementDashboard from "./components/LawEnforcementDashboard";
import LegalPersonnelDashboard from "./components/LegalPersonnelDashboard";
import Signup from "./components/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/law-enforcement/dashboard"
          element={<LawEnforcementDashboard />}
        />
        <Route path="/legal/dashboard" element={<LegalPersonnelDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
