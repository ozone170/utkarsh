import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Button, Card, Badge } from '../components/ui';
import Navbar from '../components/Navbar';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/profile');
      setUser(response.data);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load profile');
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setError('');
      const response = await api.put('/api/profile', formData);
      setUser(response.data);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditing(false);
    setError('');
  };

  const downloadIdCard = async () => {
    try {
      const response = await api.get('/api/profile/idcard', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${user.name}_ID_Card.jpg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ID card:', error);
      setError('Failed to download ID card');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-spinner">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="error-message">Failed to load profile</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="profile-actions">
            {(!user.role || user.role === 'PARTICIPANT') && (
              <Button 
                variant="secondary" 
                onClick={downloadIdCard}
                size="sm"
              >
                Download ID Card
              </Button>
            )}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="profile-content">
          <Card className="profile-card">
            <Card.Header>
              <div className="profile-card-header">
                <div className="profile-basic-info">
                  <h2 style={{ color: '#000000' }}>{user.name}</h2>
                  <Badge variant="primary" size="md">
                    {user.role}
                  </Badge>
                  {user.program && user.year && (
                    <Badge variant="secondary" size="sm">
                      {user.program} - Year {user.year}
                    </Badge>
                  )}
                </div>
              </div>
            </Card.Header>

            <Card.Body>
              <div className="profile-details">
                <div className="detail-group">
                  <label style={{ color: '#000000', fontWeight: '600' }}>Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="input"
                    />
                  ) : (
                    <span style={{ color: '#000000' }}>{user.name}</span>
                  )}
                </div>

                <div className="detail-group">
                  <label style={{ color: '#000000', fontWeight: '600' }}>Email</label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="input"
                    />
                  ) : (
                    <span style={{ color: '#000000' }}>{user.email}</span>
                  )}
                </div>

                <div className="detail-group">
                  <label style={{ color: '#000000', fontWeight: '600' }}>Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="input"
                    />
                  ) : (
                    <span style={{ color: '#000000' }}>{user.phone}</span>
                  )}
                </div>

                <div className="detail-group">
                  <label style={{ color: '#000000', fontWeight: '600' }}>Role</label>
                  <span style={{ color: '#000000' }}>{user.role}</span>
                </div>

                {user.assignedHalls && user.assignedHalls.length > 0 && (
                  <div className="detail-group">
                    <label style={{ color: '#000000', fontWeight: '600' }}>Assigned Halls</label>
                    <div className="assigned-halls">
                      {user.assignedHalls.map(hall => (
                        <Badge key={hall._id} variant="success" size="sm">
                          {hall.name} ({hall.code})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {editing && (
                  <>
                    <div className="detail-group">
                      <label style={{ color: '#000000', fontWeight: '600' }}>Program</label>
                      <select
                        name="program"
                        value={formData.program || ''}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="">Select Program</option>
                        <option value="MBA">MBA</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="BBA">BBA</option>
                        <option value="MCA">MCA</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="detail-group">
                      <label style={{ color: '#000000', fontWeight: '600' }}>Year</label>
                      <select
                        name="year"
                        value={formData.year || ''}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="">Select Year</option>
                        {(formData.program === 'MBA' ? [1, 2] : [1, 2, 3, 4]).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {!editing && user.program && (
                  <div className="detail-group">
                    <label style={{ color: '#000000', fontWeight: '600' }}>Program</label>
                    <span style={{ color: '#000000' }}>{user.program} - Year {user.year}</span>
                  </div>
                )}

                <div className="detail-group">
                  <label style={{ color: '#000000', fontWeight: '600' }}>Event ID</label>
                  <span className="event-id" style={{ color: '#000000', fontWeight: '700' }}>{user.eventId}</span>
                </div>
              </div>
            </Card.Body>

            <Card.Footer>
              <div className="profile-actions">
                {editing ? (
                  <>
                    <Button variant="success" onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button variant="ghost" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="primary" onClick={() => setEditing(true)}>
                      Edit Profile
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => navigate('/profile/change-password')}
                    >
                      Change Password
                    </Button>
                  </>
                )}
              </div>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;