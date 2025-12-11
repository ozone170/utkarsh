import { useState, useEffect } from 'react';
import { getProgramOptions, getYearOptions, getYearDisplayText, isValidYearForProgram } from '../utils/programs';
import './StudentFormModal.css';

function StudentFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  title = "Add Student",
  submitText = "Add Student"
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: 'MBA',
    year: 1,
    gender: '',
    section: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        program: initialData.program || 'MBA',
        year: initialData.year || 1,
        gender: initialData.gender || '',
        section: initialData.section || ''
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        email: '',
        phone: '',
        program: 'MBA',
        year: 1,
        gender: '',
        section: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  const handleProgramChange = (program) => {
    const allowedYears = getYearOptions(program);
    setFormData({
      ...formData,
      program,
      // Reset year to first allowed year if current year is not valid
      year: allowedYears.includes(formData.year) ? formData.year : allowedYears[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate program-year combination
    if (!isValidYearForProgram(formData.program, formData.year)) {
      setError(`Year ${formData.year} is not valid for ${formData.program} program`);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button 
            type="button" 
            className="modal-close-btn touchable"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ margin: '16px 0' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="input"
            />
          </div>

          <div className="form-row">
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="input"
            />
          </div>

          <div className="form-row">
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="input"
            />
          </div>

          <div className="form-row">
            <select
              value={formData.program}
              onChange={(e) => handleProgramChange(e.target.value)}
              required
              className="input select-input"
            >
              <option value="">Select Program</option>
              {getProgramOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              required
              className="input select-input"
            >
              <option value="">Select Year</option>
              {getYearOptions(formData.program).map(year => (
                <option key={year} value={year}>
                  {getYearDisplayText(year)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row-split">
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              required
              className="input select-input"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              required
              className="input select-input"
            >
              <option value="">Select Section</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
              <option value="D">Section D</option>
            </select>
          </div>

          {/* Program Info Display */}
          {formData.program && (
            <div className="program-info">
              <span>🎓 Program: {formData.program}</span>
              {formData.year && <span>📚 Year: {getYearDisplayText(formData.year)}</span>}
              <span>📋 Available Years: {getYearOptions(formData.program).map(y => getYearDisplayText(y)).join(', ')}</span>
            </div>
          )}

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-secondary touchable"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary touchable"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentFormModal;