import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function HallOccupancyPage() {
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState('');
  const [occupancy, setOccupancy] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHalls();
    fetchOccupancy();
  }, []);

  const fetchHalls = async () => {
    try {
      const response = await axios.get('/api/halls');
      setHalls(response.data);
    } catch (err) {
      console.error('Failed to fetch halls', err);
    }
  };

  const fetchOccupancy = async (hallId = '') => {
    setLoading(true);
    try {
      const url = hallId ? `/api/admin/hall-occupancy?hallId=${hallId}` : '/api/admin/hall-occupancy';
      const response = await axios.get(url);
      setOccupancy(response.data);
    } catch (err) {
      console.error('Failed to fetch occupancy', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHallChange = (hallId) => {
    setSelectedHall(hallId);
    fetchOccupancy(hallId);
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', color: 'white' }}>🏛️ Hall Occupancy</h1>
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
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Filter by Hall</label>
          <select
            value={selectedHall}
            onChange={(e) => handleHallChange(e.target.value)}
            className="input"
          >
            <option value="">All Halls</option>
            {halls.map((hall) => (
              <option key={hall._id} value={hall._id}>
                {hall.name} ({hall.code})
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            Loading...
          </div>
        ) : occupancy.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏛️</div>
            <p>No students currently in halls</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--light)', borderRadius: '8px' }}>
              <strong>Currently in halls: {occupancy.length} students</strong>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Event ID</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Branch</th>
                    <th>Year</th>
                    <th>Hall</th>
                    <th>Entry Time</th>
                  </tr>
                </thead>
                <tbody>
                  {occupancy.map((log) => (
                    <tr key={log._id}>
                      <td style={{ fontWeight: '600' }}>{log.userId?.name || 'N/A'}</td>
                      <td><code style={{ background: 'var(--light)', padding: '4px 8px', borderRadius: '4px' }}>{log.userId?.eventId || 'N/A'}</code></td>
                      <td>{log.userId?.email || 'N/A'}</td>
                      <td>{log.userId?.phone || 'N/A'}</td>
                      <td>{log.userId?.branch || 'N/A'}</td>
                      <td>{log.userId?.year || 'N/A'}</td>
                      <td>
                        <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                          {log.hallId?.name || 'N/A'}
                        </span>
                      </td>
                      <td>{new Date(log.entryTime).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HallOccupancyPage;
