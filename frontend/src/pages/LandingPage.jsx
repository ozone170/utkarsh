import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to Utkarsh Fresher Manager</h1>
      <p>Event management system for student registration and tracking</p>
      <button onClick={() => navigate('/register')} style={{ padding: '10px 20px', fontSize: '16px', margin: '10px' }}>
        Register Now
      </button>
      <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', fontSize: '16px', margin: '10px' }}>
        Admin/Scanner Login
      </button>
    </div>
  );
}

export default LandingPage;
