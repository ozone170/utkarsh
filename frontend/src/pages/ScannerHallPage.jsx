import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

function ScannerHallPage() {
  const navigate = useNavigate();
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState('');
  const [message, setMessage] = useState('');
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetchHalls();
  }, []);

  const startScanning = () => {
    if (selectedHall && !isScanning) {
      setIsScanning(true);
      // Wait for DOM to render
      setTimeout(() => {
        const html5QrcodeScanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } }
        );
        
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        setScanner(html5QrcodeScanner);
      }, 100);
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanner]);

  const fetchHalls = async () => {
    try {
      const response = await axios.get('/api/halls');
      setHalls(response.data);
    } catch (err) {
      console.error('Failed to fetch halls', err);
    }
  };

  const onScanSuccess = async (decodedText) => {
    try {
      // Stop scanning
      stopScanning();

      // First, get student details
      const userResponse = await axios.get(`/api/users/by-event-id/${decodedText}`);
      const studentDetails = userResponse.data;

      // Then, process the hall scan
      const scanResponse = await axios.post('/api/scan/hall', {
        eventId: decodedText,
        hallCode: selectedHall
      });
      
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
      setMessage(`✗ ${err.response?.data?.message || 'Scan failed'}`);
      setTimeout(() => {
        setMessage('');
        stopScanning();
      }, 2000);
    }
  };

  const onScanFailure = (error) => {
    // Ignore scan failures
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontSize: '36px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
            🏛️ Hall Scanner
          </h1>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/')} 
              className="btn" 
              style={{ 
                background: 'linear-gradient(135deg, #0ea5ff 0%, #06b6d4 100%)', 
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 12px rgba(14, 165, 255, 0.3)'
              }}
            >
              🏠 Landing Page
            </button>
            <button 
              onClick={() => { localStorage.clear(); navigate('/'); }} 
              className="btn" 
              style={{ 
                background: 'white', 
                color: 'var(--danger)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <div className="card" style={{ maxWidth: '700px', margin: '0 auto', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            padding: '24px', 
            borderRadius: '12px 12px 0 0', 
            marginBottom: '24px',
            color: 'white'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Select Hall Location</h2>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Choose the hall where you're scanning students</p>
          </div>

          <div style={{ padding: '0 24px 24px 24px' }}>
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

            {selectedHall && !isScanning && (
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <button 
                  onClick={startScanning} 
                  className="btn btn-primary" 
                  style={{ 
                    fontSize: '18px', 
                    padding: '16px 48px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                    transform: 'scale(1)',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  📱 Start Scanning
                </button>
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
                  <div id="reader" style={{ borderRadius: '8px', overflow: 'hidden' }}></div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button 
                    onClick={stopScanning} 
                    className="btn btn-secondary"
                    style={{
                      padding: '12px 32px',
                      fontSize: '16px'
                    }}
                  >
                    ⏹️ Stop Scanning
                  </button>
                </div>

                {message && (
                  <div 
                    className={`alert ${message.startsWith('✓') ? 'alert-success' : 'alert-error'}`} 
                    style={{ 
                      marginTop: '20px', 
                      fontSize: '16px', 
                      textAlign: 'center',
                      padding: '16px',
                      borderRadius: '8px',
                      fontWeight: '600'
                    }}
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
