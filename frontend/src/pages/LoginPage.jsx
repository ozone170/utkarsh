import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      
      if (response.data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/scanner/hall');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };



  return (
    <div className="container" style={{ paddingTop: '60px' }}>
      <div className="card" style={{ maxWidth: '450px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--dark)' }}>🔐 Login</h2>
          <p style={{ color: 'var(--text-light)' }}>Admin or Scanner Access</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            Login
          </button>
        </form>



        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button onClick={() => navigate('/')} className="btn" style={{ background: 'transparent', color: 'var(--primary)' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
