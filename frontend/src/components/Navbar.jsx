import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/landing");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate("/landing")}>
          <img
            src="/logo.jpg"
            alt="UTKARSH Logo"
            className="navbar-logo-img"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <div className="navbar-logo-text" style={{ display: "none" }}>
            <span className="navbar-logo-title">UTKARSH</span>
            <span className="navbar-logo-subtitle">2025</span>
          </div>
        </div>

        <div className="navbar-links">
          <button onClick={() => navigate("/landing")} className="navbar-link">
            Landing Page
          </button>

          {user?.role === "ADMIN" && (
            <>
              <button
                onClick={() => navigate("/admin")}
                className="navbar-link"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/admin/hall-occupancy")}
                className="navbar-link"
              >
                View Occupancy
              </button>
            </>
          )}

          {(user?.role === "SCANNER" || user?.role === "VOLUNTEER") && (
            <button
              onClick={() => navigate("/scanner/hall")}
              className="navbar-link"
            >
              Scan
            </button>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="navbar-link navbar-logout"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="navbar-link navbar-login"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
