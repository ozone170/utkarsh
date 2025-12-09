import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

function ScannerFoodPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = () => {
    if (!isScanning) {
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

  const onScanSuccess = async (decodedText) => {
    try {
      // Stop scanning
      stopScanning();

      // Process the food scan
      const scanResponse = await axios.post('/api/scan/food', {
        eventId: decodedText
      });
      
      const scanResult = {
        success: scanResponse.data.status === 'allowed',
        message: scanResponse.data.message,
        status: scanResponse.data.status,
        claimedAt: scanResponse.data.claimedAt
      };

      // Student details are now included in scan response
      const studentDetails = scanResponse.data.user;

      // Navigate to result page for both allowed and denied cases
      navigate('/scan-result', {
        state: {
          studentDetails,
          scanResult,
          scanType: 'food'
        }
      });
    } catch (err) {
      // Only show error for actual failures (404, 500, etc.)
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
            🍽️ Food Scanner
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
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
            padding: '24px', 
            borderRadius: '12px 12px 0 0', 
            marginBottom: '24px',
            color: 'white'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Food Distribution Scanner</h2>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Verify student food eligibility (one-time per day)</p>
          </div>

          <div style={{ padding: '0 24px 24px 24px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '24px',
              border: '2px solid #f59e0b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '32px' }}>ℹ️</div>
                <div>
                  <p style={{ margin: 0, color: '#78350f', fontWeight: '600', fontSize: '14px' }}>
                    Each student can claim food only once per day
                  </p>
                  <p style={{ margin: '4px 0 0 0', color: '#92400e', fontSize: '13px' }}>
                    The system will automatically check eligibility
                  </p>
                </div>
              </div>
            </div>
            
            {!isScanning && (
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
                <div style={{ textAlign: 'center', padding: '40px 20px 20px 20px', color: 'var(--text-light)' }}>
                  <div style={{ fontSize: '80px', marginBottom: '16px' }}>🍽️</div>
                  <p style={{ fontSize: '16px', fontWeight: '500' }}>Ready to scan student QR codes</p>
                  <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>Click the button above to begin</p>
                </div>
              </div>
            )}

            {isScanning && (
              <>
                <div style={{ 
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
          </div>
        </div>
      </div>
    </>
  );
}

export default ScannerFoodPage;
