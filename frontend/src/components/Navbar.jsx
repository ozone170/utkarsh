import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/landing");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside and manage body scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('navbar-open');
    } else {
      document.body.classList.remove('navbar-open');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('navbar-open');
    };
  }, [isMenuOpen]);

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => handleNavClick("/landing")}>
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

        {/* Mobile menu toggle button */}
        <button 
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`navbar-toggle-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`navbar-toggle-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`navbar-toggle-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'navbar-links-open' : ''}`}>
          <button onClick={() => handleNavClick("/landing")} className="navbar-link">
            Home Page
          </button>

          {user?.role === "ADMIN" && (
            <>
              <button
                onClick={() => handleNavClick("/admin")}
                className="navbar-link"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick("/admin/hall-occupancy")}
                className="navbar-link"
              >
                View Occupancy
              </button>
            </>
          )}

          {(user?.role === "SCANNER" || user?.role === "VOLUNTEER") && (
            <>
              <button
                onClick={() => handleNavClick("/scanner/hall")}
                className="navbar-link"
              >
                Scan
              </button>
              {user?.role === "VOLUNTEER" && (
                <button
                  onClick={() => handleNavClick("/volunteer/students")}
                  className="navbar-link"
                >
                  Registered Students
                </button>
              )}
            </>
          )}

          {user && (
            <button
              onClick={() => handleNavClick("/profile")}
              className="navbar-link"
            >
              Profile
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
              onClick={() => handleNavClick("/login")}
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
