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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>
      
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
            <h3>Total Users</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalUsers}</p>
          </div>
          <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
            <h3>Total Halls</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalHalls}</p>
          </div>
          <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
            <h3>Food Today</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.foodClaimedToday}</p>
          </div>
          <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
            <h3>In Halls Now</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.currentlyInHalls}</p>
          </div>
        </div>
      )}

      <h2>Create New Hall</h2>
      <form onSubmit={handleCreateHall} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Hall Name"
          value={newHall.name}
          onChange={(e) => setNewHall({ ...newHall, name: e.target.value })}
          required
          style={{ padding: '10px', margin: '5px' }}
        />
        <input
          type="text"
          placeholder="Hall Code"
          value={newHall.code}
          onChange={(e) => setNewHall({ ...newHall, code: e.target.value })}
          required
          style={{ padding: '10px', margin: '5px' }}
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newHall.capacity}
          onChange={(e) => setNewHall({ ...newHall, capacity: e.target.value })}
          required
          style={{ padding: '10px', margin: '5px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', margin: '5px' }}>Create Hall</button>
      </form>

      <h2>Halls</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Code</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Capacity</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {halls.map((hall) => (
            <tr key={hall._id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hall.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hall.code}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{hall.capacity}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {hall.isActive ? 'Active' : 'Inactive'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
