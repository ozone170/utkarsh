import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function HallsListPage() {
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHall, setEditingHall] = useState(null);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/halls');
      setHalls(response.data);
    } catch (err) {
      console.error('Failed to fetch halls', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHall = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/halls/${editingHall._id}`, {
        name: editingHall.name,
        code: editingHall.code,
        capacity: editingHall.capacity,
        isActive: editingHall.isActive
      });
      setEditingHall(null);
      fetchHalls();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update hall');
    }
  };

  const handleDeleteHall = async (hallId) => {
    if (window.confirm('Are you sure you want to delete this hall? This will affect all related records.')) {
      try {
        await axios.delete(`/api/halls/${hallId}`);
        fetchHalls();
      } catch (err) {
        alert('Failed to delete hall');
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', color: 'white' }}>🏛️ All Halls</h1>
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
        {editingHall && (
          <form onSubmit={handleUpdateHall} style={{ marginBottom: '24px', padding: '20px', background: '#fff3cd', borderRadius: '12px', border: '2px solid #ffc107' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>Edit Hall</h3>
              <button type="button" onClick={() => setEditingHall(null)} className="btn" style={{ background: 'transparent', color: 'var(--danger)' }}>
                ✕ Cancel
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Hall Name"
                value={editingHall.name}
                onChange={(e) => setEditingHall({ ...editingHall, name: e.target.value })}
                required
                className="input"
              />
              <input
                type="text"
                placeholder="Hall Code"
                value={editingHall.code}
                onChange={(e) => setEditingHall({ ...editingHall, code: e.target.value })}
                required
                className="input"
              />
            </div>
            <input
              type="number"
              placeholder="Capacity"
              value={editingHall.capacity}
              onChange={(e) => setEditingHall({ ...editingHall, capacity: e.target.value })}
              required
              className="input"
              style={{ marginBottom: '12px' }}
            />
            <div style={{ marginBottom: '12px', display: 'flex', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editingHall.isActive}
                  onChange={(e) => setEditingHall({ ...editingHall, isActive: e.target.checked })}
                />
                <span>Active</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editingHall.isFoodCounter || false}
                  onChange={(e) => setEditingHall({ ...editingHall, isFoodCounter: e.target.checked })}
                />
                <span>🍽️ Food Counter</span>
              </label>
            </div>
            <button type="submit" className="btn btn-primary">Update Hall</button>
          </form>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            Loading...
          </div>
        ) : halls.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏛️</div>
            <p>No halls created yet</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--light)', borderRadius: '8px' }}>
              <strong>Total Halls: {halls.length}</strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {halls.map((hall) => (
                <div key={hall._id} style={{ padding: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: 'white', position: 'relative' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏛️</div>
                  <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{hall.name}</h3>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px' }}>
                    <strong>Code:</strong> {hall.code}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px' }}>
                    <strong>Capacity:</strong> {hall.capacity}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px' }}>
                    <strong>Status:</strong> {hall.isActive ? '✓ Active' : '✗ Inactive'}
                  </div>
                  {hall.isFoodCounter && (
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px' }}>
                      <strong>🍽️ Food Counter</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setEditingHall(hall)} 
                      className="btn" 
                      style={{ flex: 1, background: 'white', color: 'var(--primary)', padding: '8px 12px', fontSize: '14px' }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteHall(hall._id)} 
                      className="btn" 
                      style={{ flex: 1, background: 'var(--danger)', color: 'white', padding: '8px 12px', fontSize: '14px' }}
                    >
                      🗑️ Delete
                    </button>
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

export default HallsListPage;
