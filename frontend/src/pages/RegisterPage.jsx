import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { getProgramOptions, getYearOptions, getYearDisplayText, isValidYearForProgram } from '../utils/programs';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    section: '',
    program: 'MBA', // Default to MBA
    year: 1 // Default to first year
  });
  const [registered, setRegistered] = useState(false);
  const [eventId, setEventId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState('');
  const idCardRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate year for program
    if (!isValidYearForProgram(formData.program, formData.year)) {
      setError(`Year ${formData.year} is not valid for ${formData.program} program`);
      return;
    }
    
    try {
      const response = await axios.post('/api/users/register', formData);
      setEventId(response.data.eventId);
      setStudentData(response.data.user);
      setRegistered(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleProgramChange = (program) => {
    const allowedYears = getYearOptions(program);
    setFormData({
      ...formData,
      program,
      // Reset year to first allowed year if current year is not valid
      year: allowedYears.includes(formData.year) ? formData.year : allowedYears[0]
    });
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
      <>
        <Navbar />
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
          <div ref={idCardRef} className="id-card" style={{
            backgroundImage: 'url(/card.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}>
            {/* Overlay for better text readability */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)',
              borderRadius: '20px'
            }}></div>

            {/* Decorative Elements */}
            <div style={{ 
              position: 'absolute', 
              top: '-50px', 
              right: '-50px', 
              width: '200px', 
              height: '200px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '50%',
              zIndex: 1
            }}></div>
            <div style={{ 
              position: 'absolute', 
              bottom: '-30px', 
              left: '-30px', 
              width: '150px', 
              height: '150px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '50%',
              zIndex: 1
            }}></div>

            {/* Logo */}
            <div style={{ 
              position: 'absolute', 
              top: '20px', 
              left: '20px', 
              zIndex: 2 
            }}>
              <img 
                src="/logo.jpg" 
                alt="UTKARSH Logo" 
                style={{ 
                  height: '50px', 
                  width: 'auto', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                }}
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>

            {/* Header */}
            <div className="id-card-header" style={{ position: 'relative', zIndex: 2 }}>
              <h1 className="id-card-title">UTKARSH</h1>
              <p className="id-card-subtitle">Fresher Event 2025</p>
            </div>

            {/* Main Content */}
            <div className="id-card-content" style={{ position: 'relative', zIndex: 2 }}>
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div className="student-detail-icon">🎓</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="student-detail-label">PROGRAM</div>
                        <div className="student-detail-value">{studentData.program} - {getYearDisplayText(studentData.year)}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div className="student-detail-icon">{studentData.gender === 'Male' ? '👨' : studentData.gender === 'Female' ? '👩' : '🧑'}</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="student-detail-label">GENDER</div>
                        <div className="student-detail-value">{studentData.gender}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="student-detail-icon">📋</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="student-detail-label">SECTION</div>
                      <div className="student-detail-value">Section {studentData.section}</div>
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
            <div className="id-card-footer" style={{ position: 'relative', zIndex: 2 }}>
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
              onClick={() => navigate('/')} 
              className="btn btn-secondary download-btn"
            >
              ← Back to Landing Page
            </button>
          </div>

          <div className="tip-box">
            <p>
              💡 <strong>Tip:</strong> Download and save your ID card. You can also take a screenshot for backup!
            </p>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container register-form-container">
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="register-form-header">
          <h2 className="register-form-title" style={{ color: '#000000' }}>🎓 Student Registration</h2>
          <p style={{ color: '#000000', fontWeight: '600' }}>UTKARSH 2025 - Fresher Event Registration</p>
        </div>

        {error && (
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            border: '3px solid #ef4444',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>❌</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#991b1b', marginBottom: '8px' }}>
              Registration Not Allowed
            </div>
            <div style={{ fontSize: '15px', color: '#b91c1c', lineHeight: '1.5' }}>
              {error}
            </div>
          </div>
        )}

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
          
          {/* Program Selection */}
          <select
            value={formData.program}
            onChange={(e) => handleProgramChange(e.target.value)}
            required
            className="input"
            style={{ 
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '20px',
              paddingRight: '40px',
              marginTop: '12px'
            }}
          >
            <option value="">Select Program</option>
            {getProgramOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Year Selection - Dynamic based on program */}
          <select
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
            required
            className="input"
            style={{ 
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '20px',
              paddingRight: '40px',
              marginTop: '12px'
            }}
          >
            <option value="">Select Year</option>
            {getYearOptions(formData.program).map(year => (
              <option key={year} value={year}>
                {getYearDisplayText(year)}
              </option>
            ))}
          </select>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              required
              className="input"
              style={{ 
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '20px',
                paddingRight: '40px'
              }}
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
              className="input"
              style={{ 
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '20px',
                paddingRight: '40px'
              }}
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
            <div style={{ 
              padding: '12px 16px', 
              background: 'rgba(14, 165, 255, 0.1)', 
              border: '1px solid rgba(14, 165, 255, 0.3)',
              borderRadius: '8px',
              color: '#0ea5ff',
              fontSize: '14px',
              textAlign: 'center',
              marginTop: '12px',
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span>🎓 Program: {formData.program}</span>
              {formData.year && <span>📚 Year: {getYearDisplayText(formData.year)}</span>}
              <span>📋 Available Years: {getYearOptions(formData.program).map(y => getYearDisplayText(y)).join(', ')}</span>
            </div>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            Register Now
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button onClick={() => navigate('/')} className="btn" style={{ background: 'transparent', color: 'var(--primary)' }}>
            ← Back to Landing Page
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default RegisterPage;
