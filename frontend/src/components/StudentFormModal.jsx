import { useState } from 'react';
import './StudentFormModal.css';

function StudentFormModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    section: '',
    branch: 'MBA',
    year: 1
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        gender: '',
        section: '',
        branch: 'MBA',
        year: 1
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Add New Student</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name <span style={{ color: 'red' }}>*</span></label>
            <input
              type="text"
              placeholder="Enter student name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Email Address <span style={{ color: 'red' }}>*</span></label>
            <input
              type="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Phone Number <span style={{ color: 'red' }}>*</span></label>
            <input
              type="tel"
              placeholder="10-digit phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender <span style={{ color: 'red' }}>*</span></label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
                className="input"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Section <span style={{ color: 'red' }}>*</span></label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                required
                className="input"
              >
                <option value="">Select Section</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>
          </div>

          <div className="info-box">
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>ℹ️</div>
            <div>
              <strong>Auto-filled fields:</strong>
              <div style={{ marginTop: '4px', fontSize: '14px' }}>
                • Branch: MBA<br />
                • Year: 1st Year<br />
                • Event ID: Auto-generated
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : '➕ Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentFormModal;
