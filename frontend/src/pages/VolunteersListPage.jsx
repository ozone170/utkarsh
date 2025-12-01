import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function VolunteersListPage() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/volunteers');
      setVolunteers(response.data);
    } catch (err) {
      console.error('Failed to fetch volunteers', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', color: 'white' }}>👥 All Volunteers</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/admin')} className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
            ← Back to Dashboard
          </button>
          <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="btn" style={{ background: 'white', color: 'var(--danger)' }}>
            Logout
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            Loading...
          </div>
        ) : volunteers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>👥</div>
            <p>No volunteers created yet</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--light)', borderRadius: '8px' }}>
              <strong>Total Volunteers: {volunteers.length}</strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {volunteers.map((volunteer) => (
                <div key={volunteer._id} style={{ padding: '24px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', borderRadius: '12px', color: 'white' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
                  <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{volunteer.name}</h3>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px' }}>
                    <strong>Email:</strong> {volunteer.email}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '8px' }}>
                    <strong>Assigned Hall:</strong> {volunteer.assignedHalls && volunteer.assignedHalls.length > 0 ? volunteer.assignedHalls[0].name : 'None'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VolunteersListPage;
