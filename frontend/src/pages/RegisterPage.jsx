import { useState } from 'react';
import QRCode from 'qrcode.react';
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
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Registration Successful!</h2>
        <p>Your Event ID: <strong>{eventId}</strong></p>
        <div style={{ margin: '20px' }}>
          <QRCode value={eventId} size={256} />
        </div>
        <p>Save this QR code for event entry</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Student Registration</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
        <input
          type="text"
          placeholder="Branch"
          value={formData.branch}
          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
          required
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
        <input
          type="number"
          placeholder="Year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
          min="1"
          max="4"
          required
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', margin: '10px 0' }}>
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
