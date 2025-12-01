import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from '../api/axios';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    year: 1
  });
  const [registered, setRegistered] = useState(false);
  const [eventId, setEventId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState('');
  const idCardRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/users/register', formData);
      setEventId(response.data.eventId);
      setStudentData(response.data.user);
      setRegistered(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const captureIDCard = async () => {
    const idCard = idCardRef.current;
    if (!idCard) return null;

    try {
      // Convert SVG QR code to canvas for better rendering
      const svgElement = idCard.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        // Create an image from SVG
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = svgUrl;
        });
        
        // Create canvas from SVG
        const qrCanvas = document.createElement('canvas');
        const qrSize = window.innerWidth < 768 ? 140 : 180;
        qrCanvas.width = qrSize;
        qrCanvas.height = qrSize;
        const ctx = qrCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0, qrSize, qrSize);
        
        // Replace SVG with canvas temporarily
        const qrWrapper = svgElement.parentElement;
        const originalSVG = svgElement;
        qrWrapper.replaceChild(qrCanvas, svgElement);
        
        // Capture the ID card
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(idCard, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true
        });
        
        // Restore original SVG
        qrWrapper.replaceChild(originalSVG, qrCanvas);
        
        // Clean up
        URL.revokeObjectURL(svgUrl);
        
        return canvas.toDataURL('image/png');
      }
      
      // Fallback if no SVG found
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(idCard, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      return canvas.toDataURL('image/png');
    } catch (err) {
      console.error('Capture failed:', err);
      throw new Error('Failed to capture ID card');
    }
  };

  const downloadIDCard = async () => {
    try {
      const dataUrl = await captureIDCard();
      if (!dataUrl) return;
      
      const link = document.createElement('a');
      link.download = `${studentData.name.replace(/\s+/g, '_')}_ID_Card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download ID card. Please try again.');
    }
  };

  if (registered && studentData) {
    const qrSize = window.innerWidth < 768 ? 140 : 180;
    
    return (
      <div className="container register-container">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="register-success-header">
            <div className="register-success-emoji">🎉</div>
            <h2 className="register-success-title">Registration Successful!</h2>
            <p className="register-success-subtitle">
              Your student ID card has been generated
            </p>
          </div>

          {/* ID Card */}
          <div ref={idCardRef} className="id-card">
            {/* Decorative Elements */}
            <div style={{ 
              position: 'absolute', 
              top: '-50px', 
              right: '-50px', 
              width: '200px', 
              height: '200px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '50%' 
            }}></div>
            <div style={{ 
              position: 'absolute', 
              bottom: '-30px', 
              left: '-30px', 
              width: '150px', 
              height: '150px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '50%' 
            }}></div>

            {/* Header */}
            <div className="id-card-header">
              <h1 className="id-card-title">UTKARSH</h1>
              <p className="id-card-subtitle">Fresher Event 2024</p>
            </div>

            {/* Main Content */}
            <div className="id-card-content">
              {/* Student Details */}
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <div className="student-name">{studentData.name}</div>
                  <div className="student-id-badge">ID: {eventId}</div>
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="student-detail-icon">📧</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="student-detail-label">EMAIL</div>
                      <div className="student-detail-value">{studentData.email}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="student-detail-icon">📱</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="student-detail-label">PHONE</div>
                      <div className="student-detail-value">{studentData.phone}</div>
                    </div>
                  </div>

                  <div className="student-details-grid">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div className="student-detail-icon">🎓</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="student-detail-label">BRANCH</div>
                        <div className="student-detail-value">{studentData.branch}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div className="student-detail-icon">📚</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="student-detail-label">YEAR</div>
                        <div className="student-detail-value">{studentData.year}{studentData.year === 1 ? 'st' : studentData.year === 2 ? 'nd' : studentData.year === 3 ? 'rd' : 'th'} Year</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="qr-code-container">
                <div className="qr-code-wrapper">
                  <QRCodeSVG value={eventId} size={qrSize} level="H" />
                </div>
                <div className="qr-code-label">SCAN FOR ENTRY</div>
              </div>
            </div>

            {/* Footer */}
            <div className="id-card-footer">
              <p style={{ margin: 0 }}>Keep this ID card safe • Present at all event venues</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              onClick={downloadIDCard} 
              className="btn btn-primary download-btn"
            >
              <span style={{ fontSize: '24px' }}>⬇️</span>
              Download ID Card
            </button>
            
            <button 
              onClick={() => window.location.href = '/'} 
              className="btn btn-secondary download-btn"
            >
              ← Back to Home
            </button>
          </div>

          <div className="tip-box">
            <p>
              💡 <strong>Tip:</strong> Download and save your ID card. You can also take a screenshot for backup!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container register-form-container">
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="register-form-header">
          <h2 className="register-form-title">🎓 Student Registration</h2>
          <p style={{ color: 'var(--text-light)' }}>Fill in your details to get your event QR code</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="input"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="input"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Branch (e.g., Computer Science)"
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            required
            className="input"
          />
          <select
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            required
            className="input"
          >
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            Register Now
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button onClick={() => window.location.href = '/'} className="btn" style={{ background: 'transparent', color: 'var(--primary)' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
