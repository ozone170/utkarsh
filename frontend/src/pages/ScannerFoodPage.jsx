import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

function ScannerFoodPage() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [message, setMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isHandling, setIsHandling] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const startScanning = () => {
    if (!isScanning && !isHandling) {
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

  const onScanSuccess = async (decodedText) => {
    // Prevent concurrent handling
    if (isHandling) return;
    
    setIsHandling(true);
    setShowSpinner(true);
    
    try {
      // Immediately stop scanning
      await stopScanning();

      // Process the food scan
      const scanResponse = await axios.post('/api/scan/food', {
        eventId: decodedText
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
          <h1 style={{ fontSize: '36px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
            🍽️ Food Scanner
          </h1>
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
            
            {!isScanning && !isHandling && (
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
                <div style={{ textAlign: 'center', padding: '40px 20px 20px 20px', color: 'var(--text-light)' }}>
                  <div style={{ fontSize: '80px', marginBottom: '16px' }}>🍽️</div>
                  <p style={{ fontSize: '16px', fontWeight: '500' }}>Ready to scan student QR codes</p>
                  <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>Click the button above to begin</p>
                </div>
              </div>
            )}

            {showSpinner && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '24px',
                padding: '20px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                borderRadius: '12px',
                border: '2px solid #f59e0b'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                <p style={{ color: '#78350f', fontWeight: '600' }}>Processing food scan...</p>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default ScannerFoodPage;
