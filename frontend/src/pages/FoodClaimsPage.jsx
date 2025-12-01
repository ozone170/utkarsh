import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function FoodClaimsPage() {
  const navigate = useNavigate();
  const [foodClaims, setFoodClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input"
            max={new Date().toISOString().split('T')[0]}
          />
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
          </>
        )}
      </div>
    </div>
  );
}

export default FoodClaimsPage;
