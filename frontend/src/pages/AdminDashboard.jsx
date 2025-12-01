import { useState, useEffect } from 'react';
import axios from '../api/axios';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [halls, setHalls] = useState([]);
  const [newHall, setNewHall] = useState({ name: '', code: '', capacity: '', isFoodCounter: false });
  const [volunteers, setVolunteers] = useState([]);
  const [newVolunteer, setNewVolunteer] = useState({ name: '', email: '', password: '', assignedHall: '' });
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchHalls();
    fetchVolunteers();
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
      setNewHall({ name: '', code: '', capacity: '', isFoodCounter: false });
      fetchHalls();
    } catch (err) {
      alert('Failed to create hall');
    }
  };

  const fetchVolunteers = async () => {
    try {
      const response = await axios.get('/api/admin/volunteers');
      setVolunteers(response.data);
    } catch (err) {
      console.error('Failed to fetch volunteers', err);
    }
  };

  const handleCreateVolunteer = async (e) => {
    e.preventDefault();
    if (!newVolunteer.assignedHall) {
      alert('Please select a hall');
      return;
    }
    try {
      await axios.post('/api/admin/volunteers', newVolunteer);
      setNewVolunteer({ name: '', email: '', password: '', assignedHall: '' });
      setShowVolunteerForm(false);
      fetchVolunteers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create volunteer');
    }
  };

  const handleUpdateVolunteer = async (e) => {
    e.preventDefault();
    if (!editingVolunteer.assignedHall) {
      alert('Please select a hall');
      return;
    }
    try {
      await axios.put(`/api/admin/volunteers/${editingVolunteer._id}`, {
        name: editingVolunteer.name,
        email: editingVolunteer.email,
        assignedHall: editingVolunteer.assignedHall
      });
      setEditingVolunteer(null);
      fetchVolunteers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update volunteer');
    }
  };

  const startEditVolunteer = (volunteer) => {
    setEditingVolunteer({
      _id: volunteer._id,
      name: volunteer.name,
      email: volunteer.email,
      assignedHall: volunteer.assignedHalls && volunteer.assignedHalls.length > 0 ? volunteer.assignedHalls[0]._id : ''
    });
    setShowVolunteerForm(false);
  };

  const handleDeleteVolunteer = async (volunteerId) => {
    if (window.confirm('Are you sure you want to delete this volunteer?')) {
      try {
        await axios.delete(`/api/admin/volunteers/${volunteerId}`);
        fetchVolunteers();
      } catch (err) {
        alert('Failed to delete volunteer');
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '36px', color: 'white' }}>📊 Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => window.location.href = '/admin/hall-occupancy'} className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
            🏛️ View Occupancy
          </button>
          <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="btn" style={{ background: 'white', color: 'var(--danger)' }}>
            Logout
          </button>
        </div>
      </div>

      {stats && (
        <div className="stats-grid">
          <div 
            className="stat-card" 
            onClick={() => window.location.href = '/admin/students'}
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3>Registered Students</h3>
            <p>{stats.totalUsers}</p>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '8px' }}>Click to view all →</div>
          </div>
          <div 
            className="stat-card" 
            onClick={() => window.location.href = '/admin/halls'}
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3>Total Halls</h3>
            <p>{stats.totalHalls}</p>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '8px' }}>Click to view all →</div>
          </div>
          <div 
            className="stat-card" 
            onClick={() => window.location.href = '/admin/food-claims'}
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3>Food Today</h3>
            <p>{stats.foodClaimedToday}</p>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '8px' }}>Click to view claims →</div>
          </div>
          <div 
            className="stat-card" 
            onClick={() => window.location.href = '/admin/hall-occupancy'}
            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3>In Halls Now</h3>
            <p>{stats.currentlyInHalls}</p>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '8px' }}>Click to view occupancy →</div>
          </div>
          <div 
            className="stat-card" 
            onClick={() => window.location.href = '/admin/volunteers'}
            style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3>Total Volunteers</h3>
            <p>{volunteers.length}</p>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '8px' }}>Click to view all →</div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 style={{ marginBottom: '20px', color: 'var(--dark)' }}>🏛️ Create New Hall</h2>
        <form onSubmit={handleCreateHall} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <input
              type="text"
              placeholder="Hall Name"
              value={newHall.name}
              onChange={(e) => setNewHall({ ...newHall, name: e.target.value })}
              required
              className="input"
            />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <input
              type="text"
              placeholder="Hall Code"
              value={newHall.code}
              onChange={(e) => setNewHall({ ...newHall, code: e.target.value })}
              required
              className="input"
            />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <input
              type="number"
              placeholder="Capacity"
              value={newHall.capacity}
              onChange={(e) => setNewHall({ ...newHall, capacity: e.target.value })}
              required
              className="input"
            />
          </div>
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'var(--light)', borderRadius: '8px' }}>
            <input
              type="checkbox"
              id="isFoodCounter"
              checked={newHall.isFoodCounter || false}
              onChange={(e) => setNewHall({ ...newHall, isFoodCounter: e.target.checked })}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="isFoodCounter" style={{ cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}>
              🍽️ Food Counter
            </label>
          </div>
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
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                      {hall.isFoodCounter && (
                        <span style={{ 
                          background: 'var(--warning)', 
                          color: 'white', 
                          padding: '4px 12px', 
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          🍽️ Food Counter
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'var(--dark)' }}>👥 Volunteer Management</h2>
          <button onClick={() => setShowVolunteerForm(!showVolunteerForm)} className="btn btn-primary">
            {showVolunteerForm ? 'Cancel' : '+ Add Volunteer'}
          </button>
        </div>

        {showVolunteerForm && (
          <form onSubmit={handleCreateVolunteer} style={{ marginBottom: '24px', padding: '20px', background: 'var(--light)', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>Create New Volunteer</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Volunteer Name"
                value={newVolunteer.name}
                onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                required
                className="input"
              />
              <input
                type="email"
                placeholder="Email"
                value={newVolunteer.email}
                onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
                required
                className="input"
              />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={newVolunteer.password}
              onChange={(e) => setNewVolunteer({ ...newVolunteer, password: e.target.value })}
              required
              className="input"
              style={{ marginBottom: '12px' }}
            />
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Assign Hall <span style={{ color: 'red' }}>*</span></label>
              <select
                value={newVolunteer.assignedHall}
                onChange={(e) => setNewVolunteer({ ...newVolunteer, assignedHall: e.target.value })}
                className="input"
                required
              >
                <option value="">Select a hall...</option>
                {halls.map((hall) => (
                  <option key={hall._id} value={hall._id}>
                    {hall.name} ({hall.code})
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Create Volunteer</button>
          </form>
        )}

        {editingVolunteer && (
          <form onSubmit={handleUpdateVolunteer} style={{ marginBottom: '24px', padding: '20px', background: '#fff3cd', borderRadius: '12px', border: '2px solid #ffc107' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>Edit Volunteer</h3>
              <button type="button" onClick={() => setEditingVolunteer(null)} className="btn" style={{ background: 'transparent', color: 'var(--danger)' }}>
                ✕ Cancel
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Volunteer Name"
                value={editingVolunteer.name}
                onChange={(e) => setEditingVolunteer({ ...editingVolunteer, name: e.target.value })}
                required
                className="input"
              />
              <input
                type="email"
                placeholder="Email"
                value={editingVolunteer.email}
                onChange={(e) => setEditingVolunteer({ ...editingVolunteer, email: e.target.value })}
                required
                className="input"
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Assign Hall <span style={{ color: 'red' }}>*</span></label>
              <select
                value={editingVolunteer.assignedHall}
                onChange={(e) => setEditingVolunteer({ ...editingVolunteer, assignedHall: e.target.value })}
                className="input"
                required
              >
                <option value="">Select a hall...</option>
                {halls.map((hall) => (
                  <option key={hall._id} value={hall._id}>
                    {hall.name} ({hall.code})
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Update Volunteer</button>
          </form>
        )}

        {volunteers.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px' }}>
            No volunteers created yet. Add your first volunteer above!
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Assigned Halls</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer._id}>
                  <td style={{ fontWeight: '600' }}>{volunteer.name}</td>
                  <td>{volunteer.email}</td>
                  <td>
                    {volunteer.assignedHalls && volunteer.assignedHalls.length > 0 ? (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {volunteer.assignedHalls.map((hall) => (
                          <span key={hall._id} style={{ background: 'var(--primary)', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                            {hall.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-light)' }}>No halls assigned</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => startEditVolunteer(volunteer)} 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '14px' }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteVolunteer(volunteer._id)} 
                        className="btn" 
                        style={{ background: 'var(--danger)', color: 'white', padding: '6px 12px', fontSize: '14px' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
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
