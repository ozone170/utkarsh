import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function FoodClaimsPage() {
  const navigate = useNavigate();
  const [foodClaims, setFoodClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  useEffect(() => {
    fetchFoodClaims();
  }, [selectedDate]);

  const fetchFoodClaims = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admin/food-claims?date=${selectedDate}`);
      setFoodClaims(response.data);
    } catch (err) {
      console.error('Failed to fetch food claims', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', color: 'white' }}>🍽️ Food Claims</h1>
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input"
              max={new Date().toISOString().split('T')[0]}
            />
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
        ) : foodClaims.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🍽️</div>
            <p>No food claims for {new Date(selectedDate).toLocaleDateString()}</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--light)', borderRadius: '8px' }}>
              <strong>Total Claims on {new Date(selectedDate).toLocaleDateString()}: {foodClaims.length}</strong>
            </div>

            {viewMode === 'table' ? (
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Event ID</th>
                      <th>Email</th>
                      <th>Branch</th>
                      <th>Year</th>
                      <th>Claim Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foodClaims.map((claim) => (
                      <tr key={claim._id}>
                        <td style={{ fontWeight: '600' }}>{claim.userId?.name || 'N/A'}</td>
                        <td><code style={{ background: 'var(--light)', padding: '4px 8px', borderRadius: '4px' }}>{claim.userId?.eventId || 'N/A'}</code></td>
                        <td>{claim.userId?.email || 'N/A'}</td>
                        <td>{claim.userId?.branch || 'N/A'}</td>
                        <td>{claim.userId?.year || 'N/A'}</td>
                        <td>{new Date(claim.time).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {foodClaims.map((claim) => (
                  <div key={claim._id} style={{ 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                    borderRadius: '12px', 
                    padding: '20px',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px', textAlign: 'center' }}>🍽️</div>
                    <h3 style={{ fontSize: '20px', marginBottom: '12px', textAlign: 'center' }}>{claim.userId?.name || 'N/A'}</h3>
                    
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>Event ID</div>
                      <div style={{ fontWeight: '600', fontSize: '16px', letterSpacing: '1px' }}>{claim.userId?.eventId || 'N/A'}</div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>Claim Time</div>
                      <div style={{ fontWeight: '600', fontSize: '16px' }}>{new Date(claim.time).toLocaleTimeString()}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>Branch</div>
                        <div style={{ fontWeight: '600', fontSize: '13px' }}>{claim.userId?.branch || 'N/A'}</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>Year</div>
                        <div style={{ fontWeight: '600', fontSize: '13px' }}>{claim.userId?.year || 'N/A'}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px', fontSize: '13px', opacity: 0.9, textAlign: 'center' }}>
                      📧 {claim.userId?.email || 'N/A'}
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

export default FoodClaimsPage;
