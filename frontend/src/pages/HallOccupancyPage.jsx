import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function HallOccupancyPage() {
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState('');
  const [occupancy, setOccupancy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
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
          
          <div style={{ display: 'flex', gap: '8px', background: 'var(--light)', padding: '4px', borderRadius: '8px' }}>
            <button
              onClick={() => setViewMode('table')}
              className="btn"
              style={{
                background: viewMode === 'table' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'table' ? 'white' : 'var(--text)',
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              📋 Table
            </button>
            <button
              onClick={() => setViewMode('card')}
              className="btn"
              style={{
                background: viewMode === 'card' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'card' ? 'white' : 'var(--text)',
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              🎴 Cards
            </button>
          </div>
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

            {viewMode === 'table' ? (
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
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {occupancy.map((log) => (
                  <div key={log._id} style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    borderRadius: '12px', 
                    padding: '20px',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px', textAlign: 'center' }}>👤</div>
                    <h3 style={{ fontSize: '20px', marginBottom: '12px', textAlign: 'center' }}>{log.userId?.name || 'N/A'}</h3>
                    
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>Event ID</div>
                      <div style={{ fontWeight: '600', fontSize: '16px', letterSpacing: '1px' }}>{log.userId?.eventId || 'N/A'}</div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>Current Hall</div>
                      <div style={{ fontWeight: '600', fontSize: '16px' }}>{log.hallId?.name || 'N/A'}</div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>Entry Time</div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{new Date(log.entryTime).toLocaleString()}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>Branch</div>
                        <div style={{ fontWeight: '600', fontSize: '13px' }}>{log.userId?.branch || 'N/A'}</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>Year</div>
                        <div style={{ fontWeight: '600', fontSize: '13px' }}>{log.userId?.year || 'N/A'}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', fontSize: '13px', opacity: 0.9, textAlign: 'center' }}>
                      📧 {log.userId?.email || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HallOccupancyPage;
