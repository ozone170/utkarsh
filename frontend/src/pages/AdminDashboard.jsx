import { useState, useEffect } from 'react';
import axios from '../api/axios';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [halls, setHalls] = useState([]);
  const [newHall, setNewHall] = useState({ name: '', code: '', capacity: '' });

  useEffect(() => {
    fetchStats();
    fetchHalls();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats/overview');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchHalls = async () => {
    try {
      const response = await axios.get('/api/halls');
      setHalls(response.data);
    } catch (err) {
      console.error('Failed to fetch halls', err);
    }
  };

  const handleCreateHall = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/halls', newHall);
      setNewHall({ name: '', code: '', capacity: '' });
      fetchHalls();
    } catch (err) {
      alert('Failed to create hall');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', color: 'white' }}>📊 Admin Dashboard</h1>
        <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
          Logout
        </button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <h3>Total Halls</h3>
            <p>{stats.totalHalls}</p>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            <h3>Food Today</h3>
            <p>{stats.foodClaimedToday}</p>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
            <h3>In Halls Now</h3>
            <p>{stats.currentlyInHalls}</p>
          </div>
        </div>
      )}

      <div className="card">
        <h2 style={{ marginBottom: '20px', color: 'var(--dark)' }}>🏛️ Create New Hall</h2>
        <form onSubmit={handleCreateHall} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Hall Name"
            value={newHall.name}
            onChange={(e) => setNewHall({ ...newHall, name: e.target.value })}
            required
            className="input"
            style={{ flex: '1 1 200px' }}
          />
          <input
            type="text"
            placeholder="Hall Code"
            value={newHall.code}
            onChange={(e) => setNewHall({ ...newHall, code: e.target.value })}
            required
            className="input"
            style={{ flex: '1 1 150px' }}
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newHall.capacity}
            onChange={(e) => setNewHall({ ...newHall, capacity: e.target.value })}
            required
            className="input"
            style={{ flex: '1 1 150px' }}
          />
          <button type="submit" className="btn btn-primary">Create Hall</button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px', color: 'var(--dark)' }}>📋 Halls List</h2>
        {halls.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px' }}>
            No halls created yet. Create your first hall above!
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Capacity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {halls.map((hall) => (
                <tr key={hall._id}>
                  <td>{hall.name}</td>
                  <td><code style={{ background: 'var(--light)', padding: '4px 8px', borderRadius: '4px' }}>{hall.code}</code></td>
                  <td>{hall.capacity}</td>
                  <td>
                    <span style={{ 
                      background: hall.isActive ? 'var(--success)' : 'var(--danger)', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {hall.isActive ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
