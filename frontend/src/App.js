import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, FileText, Lightbulb, UserCircle, BarChart, LayoutDashboard, PlusCircle, Users, LogOut, Bell, Moon } from "lucide-react";

import Home from "./pages/seeker/Home";
import Suggestions from "./pages/seeker/Suggestions";
import CV from "./pages/seeker/CV";
import JobAnalyzer from "./pages/seeker/JobAnalyzer";
import Login from "./pages/Login";
import Employer from "./pages/employer/Employer";
import Candidates from "./pages/employer/Candidates";
import PostJob from "./pages/employer/PostJob";

const linkClass = ({ isActive }) => isActive ? "menu-item active" : "menu-item";

const SidebarLayout = ({ user, handleLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div style={{ fontWeight: "bold", fontSize: "1.2rem", letterSpacing: "1px" }}>JobTracker</div>
        <button onClick={toggleSidebar} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
        <div className="desktop-logo" style={{ marginBottom: "5px" }}>
          JobTracker
        </div>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: user?.role === "employer" ? "#22c55e" : "#3b82f6",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "6px 10px",
            borderRadius: "8px",
            display: "inline-block",
            fontWeight: "600"
          }}>
            {user?.role === "employer" ? "İŞVEREN PANELİ" : "İŞ ARAYAN PANELİ"}
          </div>
        </div>

        <div className="sidebar-menu">
          {user?.role === "seeker" && (
            <>
              <NavLink to="/home" className={linkClass} onClick={() => setIsSidebarOpen(false)}><FileText size={20} /> Başvurular</NavLink>
              <NavLink to="/suggestions" className={linkClass} onClick={() => setIsSidebarOpen(false)}><Lightbulb size={20} /> Öneriler</NavLink>
              <NavLink to="/cv" className={linkClass} onClick={() => setIsSidebarOpen(false)}><UserCircle size={20} /> CV</NavLink>
              <NavLink to="/analyze" className={linkClass} onClick={() => setIsSidebarOpen(false)}><BarChart size={20} /> İlan Analizi</NavLink>
            </>
          )}

          {user?.role === "employer" && (
            <>
              <NavLink to="/employer" className={linkClass} onClick={() => setIsSidebarOpen(false)}><LayoutDashboard size={20} /> Dashboard</NavLink>
              <NavLink to="/post-job" className={linkClass} onClick={() => setIsSidebarOpen(false)}><PlusCircle size={20} /> İlan Ver</NavLink>
              <NavLink to="/candidates" className={linkClass} onClick={() => setIsSidebarOpen(false)}><Users size={20} /> Adaylar</NavLink>
            </>
          )}
        </div>

        {/* User Info & Logout */}
        <div className="sidebar-footer">
          <div className="user-info">{user?.username}</div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Çıkış
          </button>
        </div>
      </div>

      {/* Main Content Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <main className="content">
        {/* Top Header */}
        <div style={{
          height: "60px",
          background: "white",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 30px",
          margin: "-30px -30px 30px -30px",
          gap: "20px"
        }}>
          {/* Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px", borderRight: "1px solid #eee", paddingRight: "20px" }}>
            <Moon size={20} style={{ cursor: "pointer", color: "#64748b" }} />
            <Bell size={20} style={{ cursor: "pointer", color: "#64748b" }} />
          </div>
          {/* User Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#334155" }}>{user?.username}</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#3b82f6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
              {user?.username?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  if (user === undefined) return <div>Yükleniyor...</div>;

  const isSeeker = user?.role === "seeker";
  const isEmployer = user?.role === "employer";

  return (
    <Router>
      {!user ? (
        <Login />
      ) : (
        <SidebarLayout user={user} handleLogout={handleLogout}>
          <Routes>
            <Route path="/" element={
              isEmployer
                ? <Navigate to="/employer" />
                : <Navigate to="/home" />
            } />

            {/* SEEKER */}
            <Route path="/home" element={isSeeker ? <Home /> : <Navigate to="/employer" />} />
            <Route path="/suggestions" element={isSeeker ? <Suggestions /> : <Navigate to="/employer" />} />
            <Route path="/cv" element={isSeeker ? <CV /> : <Navigate to="/employer" />} />
            <Route path="/analyze" element={isSeeker ? <JobAnalyzer /> : <Navigate to="/employer" />} />

            {/* EMPLOYER */}
            <Route path="/employer" element={isEmployer ? <Employer /> : <Navigate to="/home" />} />
            <Route path="/post-job" element={isEmployer ? <PostJob /> : <Navigate to="/home" />} />
            <Route path="/candidates" element={isEmployer ? <Candidates /> : <Navigate to="/home" />} />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </SidebarLayout>
      )}
    </Router>
  );
}

export default App;