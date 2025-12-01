import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from '../api/axios';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    year: 1
  });
  const [registered, setRegistered] = useState(false);
  const [eventId, setEventId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/users/register', formData);
      setEventId(response.data.eventId);
      setRegistered(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  if (registered) {
    return (
      <div className="container" style={{ paddingTop: '60px' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--success)' }}>Registration Successful!</h2>
          <p style={{ fontSize: '18px', color: 'var(--text-light)', marginBottom: '24px' }}>
            Your Event ID: <strong style={{ color: 'var(--primary)', fontSize: '24px' }}>{eventId}</strong>
          </p>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <QRCodeSVG value={eventId} size={256} />
          </div>
          <p style={{ marginTop: '24px', color: 'var(--text-light)' }}>
            📱 Save this QR code for event entry
          </p>
          <button onClick={() => window.location.href = '/'} className="btn btn-primary" style={{ marginTop: '24px' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '60px' }}>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--dark)' }}>🎓 Student Registration</h2>
          <p style={{ color: 'var(--text-light)' }}>Fill in your details to get your event QR code</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="input"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="input"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Branch (e.g., Computer Science)"
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            required
            className="input"
          />
          <select
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            required
            className="input"
          >
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            Register Now
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button onClick={() => window.location.href = '/'} className="btn" style={{ background: 'transparent', color: 'var(--primary)' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
