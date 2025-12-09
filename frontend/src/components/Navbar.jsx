import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ showBackButton = false }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <img 
            src="/logo.jpg" 
            alt="UTKARSH Logo" 
            className="navbar-logo-img"
            onError={(e) => {
              // Fallback if logo doesn't exist
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="navbar-logo-text" style={{ display: 'none' }}>
            <span className="navbar-logo-title">UTKARSH</span>
            <span className="navbar-logo-subtitle">2025</span>
          </div>
        </div>
        
        {showBackButton && (
          <button 
            onClick={() => navigate('/')} 
            className="navbar-back-btn"
          >
            ← Back to Home
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
