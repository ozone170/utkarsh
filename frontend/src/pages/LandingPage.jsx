import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '60px' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Utkarsh Fresher Manager
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-light)', marginBottom: '32px' }}>
          Modern event management system for student registration and tracking
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')} className="btn btn-primary">
            🎓 Register as Student
          </button>
          <button onClick={() => navigate('/login')} className="btn btn-secondary">
            🔐 Admin/Scanner Login
          </button>
        </div>



        <div style={{ marginTop: '32px', padding: '20px', background: 'var(--light)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '12px', color: 'var(--dark)' }}>✨ Features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', textAlign: 'left' }}>
            <div>📝 Student Registration</div>
            <div>🏛️ Hall Tracking</div>
            <div>🍽️ Food Distribution</div>
            <div>📊 Admin Dashboard</div>
            <div>📱 QR Code Scanning</div>
            <div>📈 Real-time Stats</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
