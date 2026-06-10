import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Profile from "./pages/Profile";
import Clients from "./pages/Clients";
import Contracts from "./pages/Contracts";
import Notifications from "./pages/Notifications";
import Companies from "./pages/Companies";
import { enums } from "./constants";
import { useEffect } from "react";
import Admin from "./pages/Admin/Admin";
import AdminAuthPage from "./pages/Admin/AdminAuthPage";

function App() {
  useEffect(() => {
    const theme = localStorage.getItem(enums.THEME);

    if (theme === "light") {
      document.body.style.filter = "invert()";
    } else {
      document.body.style.filter = "";
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminAuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
