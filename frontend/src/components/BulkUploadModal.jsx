import { useState } from 'react';
import axios from '../api/axios';
import { getProgramOptions } from '../utils/programs';
import './BulkUploadModal.css';

function BulkUploadModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [defaultProgram, setDefaultProgram] = useState('MBA');
  const [uploadResults, setUploadResults] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['.csv', '.xlsx', '.xls'];
      const fileExt = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(fileExt)) {
        setError('Invalid file type. Please upload CSV or XLSX files only.');
        return;
      }

      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size too large. Please upload files smaller than 5MB.');
        return;
      }

      setFile(selectedFile);
      setError('');
      setUploadResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('defaultProgram', defaultProgram);
      formData.append('forceApply', 'false'); // Preview mode

      const response = await axios.post('/api/admin/upload/students', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleApply = async () => {
    if (!file) return;

    setIsApplying(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('defaultProgram', defaultProgram);
      formData.append('forceApply', 'true'); // Apply mode

      const response = await axios.post('/api/admin/upload/students', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadResults(response.data);
      
      if (response.data.applied && response.data.applied.created > 0) {
        onSuccess && onSuccess(response.data.applied.created);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Apply failed');
    } finally {
      setIsApplying(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await axios.get('/api/admin/download/template', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student-upload-template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download template');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadResults(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bulk-upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📊 Bulk Upload Students</h2>
          <button 
            type="button" 
            className="modal-close-btn touchable"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {!uploadResults ? (
            // Upload Form
            <div className="upload-form">
              <div className="upload-instructions">
                <h3>📋 Instructions</h3>
                <ul>
                  <li>Upload CSV or XLSX files with student data</li>
                  <li>Required columns: name, email, phone, program, year, gender, section</li>
                  <li>Maximum file size: 5MB</li>
                  <li>The system will validate program-year combinations</li>
                </ul>
                
                <button 
                  onClick={downloadTemplate}
                  className="btn btn-secondary touchable"
                  style={{ marginTop: '12px' }}
                >
                  📥 Download Template
                </button>
              </div>

              <div className="upload-section">
                <div className="form-row">
                  <label>Default Program (for rows without program):</label>
                  <select
                    value={defaultProgram}
                    onChange={(e) => setDefaultProgram(e.target.value)}
                    className="input select-input"
                  >
                    {getProgramOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <label>Select File:</label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  {file && (
                    <div className="file-info">
                      <span>📄 {file.name}</span>
                      <span>({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="alert alert-error">
                    {error}
                  </div>
                )}

                <div className="upload-actions">
                  <button 
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="btn btn-primary touchable"
                  >
                    {isUploading ? '🔄 Processing...' : '🔍 Preview Upload'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Results Display
            <div className="upload-results">
              <div className="results-summary">
                <h3>📊 Upload Results</h3>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Rows:</span>
                    <span className="stat-value">{uploadResults.processing.totalRows}</span>
                  </div>
                  <div className="stat-item success">
                    <span className="stat-label">Valid:</span>
                    <span className="stat-value">{uploadResults.processing.validRows}</span>
                  </div>
                  <div className="stat-item error">
                    <span className="stat-label">Invalid:</span>
                    <span className="stat-value">{uploadResults.processing.invalidRows}</span>
                  </div>
                  <div className="stat-item warning">
                    <span className="stat-label">Existing:</span>
                    <span className="stat-value">
                      {uploadResults.processing.existingEmails + uploadResults.processing.existingPhones}
                    </span>
                  </div>
                </div>
              </div>

              {uploadResults.applied ? (
                // Applied Results
                <div className="applied-results">
                  <div className="success-message">
                    <h4>✅ Upload Applied Successfully!</h4>
                    <p>Created {uploadResults.applied.created} new students</p>
                    {uploadResults.applied.failed > 0 && (
                      <p className="error">Failed to create {uploadResults.applied.failed} students</p>
                    )}
                  </div>
                </div>
              ) : (
                // Preview Results
                <div className="preview-results">
                  {uploadResults.processing.invalidRows > 0 && (
                    <div className="invalid-section">
                      <h4>❌ Invalid Records ({uploadResults.processing.invalidRows})</h4>
                      <div className="records-list">
                        {uploadResults.preview.invalid.map((record, index) => (
                          <div key={index} className="record-item error">
                            <div className="record-header">
                              Row {record.rowIndex}: {record.data.name || 'Unknown'}
                            </div>
                            <div className="record-errors">
                              {record.errors.map((error, i) => (
                                <span key={i} className="error-tag">{error}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(uploadResults.processing.existingEmails > 0 || uploadResults.processing.existingPhones > 0) && (
                    <div className="existing-section">
                      <h4>⚠️ Existing Records ({uploadResults.processing.existingEmails + uploadResults.processing.existingPhones})</h4>
                      <p>These records already exist in the database and will be skipped unless you force apply.</p>
                    </div>
                  )}

                  {uploadResults.canApply && (
                    <div className="apply-section">
                      <h4>✅ Ready to Create ({uploadResults.processing.validRows} students)</h4>
                      <div className="apply-actions">
                        <button 
                          onClick={handleApply}
                          disabled={isApplying}
                          className="btn btn-primary touchable"
                        >
                          {isApplying ? '🔄 Creating...' : '✅ Create Students'}
                        </button>
                        <button 
                          onClick={resetUpload}
                          className="btn btn-secondary touchable"
                        >
                          🔄 Upload Different File
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BulkUploadModal;