import { useState, useRef } from 'react';
import { Button } from './ui';
import api from '../api/axios';
import './PhotoUpload.css';

const PhotoUpload = ({ currentPhoto, onPhotoUpdate, disabled = false }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadPhoto(file);
    }
  };

  const uploadPhoto = async (file) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 3 * 1024 * 1024) { // 3MB limit
      setError('File size must be less than 3MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('photo', file);

      await api.post('/api/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh profile data
      if (onPhotoUpdate) {
        onPhotoUpdate();
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = async () => {
    if (!currentPhoto) return;

    setUploading(true);
    setError('');

    try {
      await api.delete('/api/profile/photo');
      
      // Refresh profile data
      if (onPhotoUpdate) {
        onPhotoUpdate();
      }
    } catch (error) {
      console.error('Error removing photo:', error);
      setError(error.response?.data?.message || 'Failed to remove photo');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="photo-upload">
      <div className="photo-container">
        {currentPhoto ? (
          <>
            <img 
              src={currentPhoto.startsWith('http') ? currentPhoto : `${import.meta.env.VITE_API_BASE_URL}${currentPhoto}`} 
              alt="Profile" 
              className="profile-photo"
              onError={(e) => {
                console.error('Failed to load profile photo:', currentPhoto);
                e.target.style.display = 'none';
                const placeholder = e.target.parentNode.querySelector('.photo-placeholder');
                if (placeholder) {
                  placeholder.style.display = 'flex';
                }
              }}
            />
            <div className="photo-placeholder" style={{ display: 'none' }}>
              <svg 
                className="photo-placeholder-icon" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </div>
          </>
        ) : (
          <div className="photo-placeholder">
            <svg 
              className="photo-placeholder-icon" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </div>
        )}
        
        {uploading && (
          <div className="photo-overlay">
            <div className="upload-spinner">
              <svg className="spinner" viewBox="0 0 24 24">
                <circle
                  className="spinner-circle"
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="photo-error">
          {error}
        </div>
      )}

      <div className="photo-actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={disabled || uploading}
        />
        
        <Button
          variant="primary"
          size="sm"
          onClick={triggerFileSelect}
          disabled={disabled || uploading}
          loading={uploading}
        >
          {currentPhoto ? 'Change Photo' : 'Upload Photo'}
        </Button>
        
        {currentPhoto && (
          <Button
            variant="danger"
            size="sm"
            onClick={removePhoto}
            disabled={disabled || uploading}
          >
            Remove
          </Button>
        )}
      </div>

      <div className="photo-help">
        <small>
          JPEG or PNG, max 3MB
          <br />
          Recommended: 256×256 pixels
        </small>
      </div>
    </div>
  );
};

export default PhotoUpload;