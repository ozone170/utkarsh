import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

function ScannerHallPage() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState('');
  const [message, setMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isHandling, setIsHandling] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAutoSelected, setIsAutoSelected] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchHalls();
  }, []);

  const startScanning = () => {
    if (selectedHall && !isScanning && !isHandling) {
      setIsScanning(true);
      setMessage('');
      // Wait for DOM to render
      setTimeout(() => {
        const html5QrcodeScanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } }
        );
        
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = html5QrcodeScanner;
      }, 100);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
      } catch (error) {
        console.log('Scanner already cleared');
      }
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/profile');
      setCurrentUser(response.data);
      
      // Auto-select hall if user has assigned halls
      if (response.data.assignedHalls && response.data.assignedHalls.length > 0) {
        const assignedHall = response.data.assignedHalls[0]; // Use first assigned hall
        setSelectedHall(assignedHall.code);
        setIsAutoSelected(true);
      }
    } catch (err) {
      console.error('Failed to fetch current user', err);
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

  const onScanSuccess = async (decodedText) => {
    // Prevent concurrent handling
    if (isHandling) return;
    
    setIsHandling(true);
    setShowSpinner(true);
    
    try {
      // Immediately stop scanning
      await stopScanning();

      // First, get student details
      const userResponse = await axios.get(`/api/users/by-event-id/${decodedText}`);
      const studentDetails = userResponse.data;

      // Then, process the hall scan
      const scanResponse = await axios.post('/api/scan/hall', {
        eventId: decodedText,
        hallCode: selectedHall
      });
      
      // Handle duplicate scan response
      if (scanResponse.data.isDuplicate) {
        setMessage(`⚠️ ${scanResponse.data.message}`);
        setTimeout(() => {
          setMessage('');
          setIsHandling(false);
          setShowSpinner(false);
        }, 2000);
        return;
      }
      
      const scanResult = {
        success: true,
        message: scanResponse.data.message,
        status: scanResponse.data.status,
        hall: scanResponse.data.hall,
        from: scanResponse.data.from,
        to: scanResponse.data.to
      };

      // Navigate to result page
      navigate('/scan-result', {
        state: {
          studentDetails,
          scanResult,
          scanType: 'hall'
        }
      });
    } catch (err) {
      let errorMessage = 'Scan failed';
      let timeout = 2000;
      
      if (err.response?.status === 429) {
        errorMessage = '⏳ Too many requests - please wait before scanning again';
        timeout = 5000;
      } else {
        errorMessage = `✗ ${err.response?.data?.message || 'Scan failed'}`;
      }
      
      setMessage(errorMessage);
      setTimeout(() => {
        setMessage('');
        setIsHandling(false);
        setShowSpinner(false);
      }, timeout);
    }
  };

  const onScanFailure = (error) => {
    // Ignore scan failures
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: window.innerWidth <= 768 ? '28px' : '36px', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            textAlign: 'center',
            justifyContent: 'center'
          }}>
            🏛️ Hall Scanner
          </h1>
        </div>

        <div className="card" style={{ maxWidth: '700px', margin: '0 auto', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            padding: '24px', 
            borderRadius: '12px 12px 0 0', 
            marginBottom: '24px',
            color: 'white'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
              {isAutoSelected ? 'Ready to Scan' : 'Select Hall Location'}
            </h2>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
              {isAutoSelected 
                ? `Scanning for ${currentUser?.assignedHalls?.[0]?.name || 'assigned hall'}`
                : 'Choose the hall where you\'re scanning students'
              }
            </p>
          </div>

          <div style={{ padding: '0 24px 24px 24px' }}>
            {isAutoSelected ? (
              <div style={{
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #10b981',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏛️</div>
                <h3 style={{ color: '#065f46', margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700' }}>
                  {currentUser?.assignedHalls?.[0]?.name}
                </h3>
                <p style={{ color: '#047857', margin: 0, fontSize: '14px', fontWeight: '600' }}>
                  Code: {currentUser?.assignedHalls?.[0]?.code}
                </p>
                <button
                  onClick={() => {
                    setIsAutoSelected(false);
                    setSelectedHall('');
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #059669',
                    color: '#059669',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    marginTop: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Change Hall
                </button>
              </div>
            ) : (
              <select
                value={selectedHall}
                onChange={(e) => setSelectedHall(e.target.value)}
                className="input"
                style={{ 
                  fontSize: '18px', 
                  padding: '16px',
                  border: '2px solid var(--light)',
                  transition: 'all 0.3s ease'
                }}
              >
                <option value="">🏛️ Choose a hall...</option>
                {halls.map((hall) => (
                  <option key={hall._id} value={hall.code}>
                    {hall.name} ({hall.code})
                  </option>
                ))}
              </select>
            )}

            {selectedHall && !isScanning && !isHandling && (
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <button 
                  onClick={startScanning} 
                  className="btn btn-primary scanner-button touchable" 
                  style={{ 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  📱 Start Scanning
                </button>
              </div>
            )}

            {showSpinner && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '24px',
                padding: '20px',
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '12px',
                border: '2px solid #0ea5ff'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                <p style={{ color: '#0f172a', fontWeight: '600' }}>Processing scan...</p>
              </div>
            )}

            {isScanning && (
              <>
                <div style={{ 
                  marginTop: '24px', 
                  padding: '24px', 
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
                  borderRadius: '12px',
                  border: '2px solid #0ea5ff'
                }}>
                  <p style={{ 
                    textAlign: 'center', 
                    color: '#0f172a', 
                    marginBottom: '16px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    📱 Position QR code within the frame
                  </p>
                  <div className="scanner-container">
                    <div id="reader" className="scanner-frame"></div>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button 
                    onClick={stopScanning} 
                    className="btn btn-secondary scanner-button touchable"
                  >
                    ⏹️ Stop Scanning
                  </button>
                </div>

                {message && (
                  <div 
                    className={`alert scanner-message ${message.startsWith('✓') ? 'alert-success' : 'alert-error'}`}
                  >
                    {message}
                  </div>
                )}
              </>
            )}

            {!selectedHall && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏛️</div>
                <p style={{ fontSize: '18px', fontWeight: '500' }}>Select a hall above to start scanning</p>
                <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>Track student entry, exit, and movement between halls</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ScannerHallPage;
