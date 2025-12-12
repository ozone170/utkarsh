import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

function VolunteersListPage() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [halls, setHalls] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [assigningHall, setAssigningHall] = useState('');

  useEffect(() => {
    fetchVolunteers();
    fetchHalls();
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

  const fetchHalls = async () => {
    try {
      const response = await axios.get('/api/halls');
      setHalls(response.data.filter(hall => hall.isActive));
    } catch (err) {
      console.error('Failed to fetch halls', err);
    }
  };

  const handleAssignHall = async () => {
    if (!selectedVolunteer || !assigningHall) return;
    
    try {
      await axios.put(`/api/admin/volunteers/${selectedVolunteer._id}/assign`, {
        hallId: assigningHall
      });
      
      setShowAssignModal(false);
      setSelectedVolunteer(null);
      setAssigningHall('');
      fetchVolunteers(); // Refresh the list
      alert('Volunteer assigned successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign volunteer');
    }
  };

  const handleUnassignVolunteer = async (volunteer) => {
    if (window.confirm(`Are you sure you want to unassign ${volunteer.name} from all halls?`)) {
      try {
        await axios.put(`/api/admin/volunteers/${volunteer._id}/assign`, {
          hallId: null
        });
        
        fetchVolunteers(); // Refresh the list
        alert('Volunteer unassigned successfully!');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to unassign volunteer');
      }
    }
  };

  const openAssignModal = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setAssigningHall(volunteer.assignedHalls && volunteer.assignedHalls.length > 0 ? volunteer.assignedHalls[0]._id : '');
    setShowAssignModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', color: 'white' }}>👥 All Volunteers</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/admin')} className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
            ← Back to Dashboard
          </button>
          <button onClick={() => { localStorage.clear(); navigate('/'); }} className="btn" style={{ background: 'white', color: 'var(--danger)' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {volunteers.map((volunteer) => (
                <div key={volunteer._id} style={{ padding: '24px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', borderRadius: '12px', color: 'white', boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
                  <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{volunteer.name}</h3>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px' }}>
                    <strong>Email:</strong> {volunteer.email}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <strong>Assigned Hall:</strong> {volunteer.assignedHalls && volunteer.assignedHalls.length > 0 ? volunteer.assignedHalls[0].name : 'None'}
                  </div>
                  
                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => navigate(`/admin/activity/${volunteer._id}`)} 
                      className="btn" 
                      style={{ 
                        flex: 1, 
                        padding: '8px 12px', 
                        fontSize: '13px', 
                        background: 'rgba(245, 158, 11, 0.9)', 
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600'
                      }}
                    >
                      📊 Activity
                    </button>
                    <button 
                      onClick={() => openAssignModal(volunteer)} 
                      className="btn" 
                      style={{ 
                        flex: 1, 
                        padding: '8px 12px', 
                        fontSize: '13px', 
                        background: 'rgba(16, 185, 129, 0.9)', 
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600'
                      }}
                    >
                      🏛️ Assign
                    </button>
                    {volunteer.assignedHalls && volunteer.assignedHalls.length > 0 && (
                      <button 
                        onClick={() => handleUnassignVolunteer(volunteer)} 
                        className="btn" 
                        style={{ 
                          padding: '8px 12px', 
                          fontSize: '13px', 
                          background: 'rgba(239, 68, 68, 0.9)', 
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: '600'
                        }}
                      >
                        ❌ Unassign
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Assign Hall Modal */}
      {showAssignModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>
              🏛️ Assign Hall to {selectedVolunteer?.name}
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Select Hall:
              </label>
              <select
                value={assigningHall}
                onChange={(e) => setAssigningHall(e.target.value)}
                className="input"
                style={{ width: '100%' }}
              >
                <option value="">Select a hall...</option>
                {halls.map((hall) => (
                  <option key={hall._id} value={hall._id}>
                    {hall.name} ({hall.code}) - Capacity: {hall.capacity}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ 
              padding: '16px', 
              background: 'rgba(59, 130, 246, 0.1)', 
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: 0, color: '#3b82f6', fontSize: '14px' }}>
                💡 <strong>Note:</strong> Assigning a new hall will replace any existing assignment. 
                Leave empty to unassign the volunteer from all halls.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedVolunteer(null);
                  setAssigningHall('');
                }}
                className="btn"
                style={{ background: '#6b7280', color: 'white' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAssignHall}
                className="btn btn-primary"
                disabled={!assigningHall}
                style={{ 
                  opacity: assigningHall ? 1 : 0.5,
                  cursor: assigningHall ? 'pointer' : 'not-allowed'
                }}
              >
                {assigningHall ? 'Assign Hall' : 'Select Hall'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default VolunteersListPage;
