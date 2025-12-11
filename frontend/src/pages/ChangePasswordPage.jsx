import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './ChangePasswordPage.css';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('Current password is required');
      return false;
    }

    if (!formData.newPassword) {
      setError('New password is required');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.put('/api/profile/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccess('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="change-password-page">
      <Navbar />
      <div className="container">
        <div className="change-password-header">
          <h1>Change Password</h1>
          <p>Update your account password</p>
        </div>

        <div className="change-password-content">
          <Card className="change-password-card">
            <Card.Header>
              <Card.Title>Security Settings</Card.Title>
              <Card.Description>
                Choose a strong password to keep your account secure
              </Card.Description>
            </Card.Header>

            <Card.Body>
              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter your current password"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter your new password"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <small className="form-help">
                    Password must be at least 6 characters long
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Confirm your new password"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="password-strength-tips">
                  <h4>Password Tips:</h4>
                  <ul>
                    <li>Use at least 6 characters</li>
                    <li>Include both letters and numbers</li>
                    <li>Avoid using personal information</li>
                    <li>Don't reuse old passwords</li>
                  </ul>
                </div>
              </form>
            </Card.Body>

            <Card.Footer>
              <div className="form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  Change Password
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;