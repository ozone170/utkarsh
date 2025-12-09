import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      // Store user data in AuthContext
      const userData = {
        name: response.data.name,
        role: response.data.role,
        assignedHall: response.data.assignedHall
      };
      
      login(response.data.token, userData);
      
      // Navigate based on role
      if (response.data.role === 'ADMIN') {
        navigate('/admin');
      } else if (response.data.role === 'VOLUNTEER' && response.data.assignedHall) {
        // Check if assigned hall is a food counter
        if (response.data.assignedHall.isFoodCounter) {
          navigate('/scanner/food');
        } else {
          navigate('/scanner/hall');
        }
      } else {
        navigate('/scanner/hall');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };



  return (
    <>
      <Navbar />
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
        </div>
      </div>
    </>
  );
}

export default LoginPage;
