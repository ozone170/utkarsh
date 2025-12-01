import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from '../api/axios';

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
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', color: 'white' }}>🏛️ Hall Scanner</h1>
        <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
          Logout
        </button>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--dark)' }}>Select Hall</h2>
        <select
          value={selectedHall}
          onChange={(e) => setSelectedHall(e.target.value)}
          className="input"
          style={{ fontSize: '18px' }}
        >
          <option value="">Choose a hall...</option>
          {halls.map((hall) => (
            <option key={hall._id} value={hall.code}>
              {hall.name} ({hall.code})
            </option>
          ))}
        </select>

        {selectedHall && !isScanning && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button onClick={startScanning} className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>
              📱 Start Scanning
            </button>
          </div>
        )}

        {isScanning && (
          <>
            <div style={{ marginTop: '24px', padding: '20px', background: 'var(--light)', borderRadius: '12px' }}>
              <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '16px' }}>
                📱 Scan student QR code
              </p>
              <div id="reader" style={{ borderRadius: '8px', overflow: 'hidden' }}></div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button onClick={stopScanning} className="btn btn-secondary">
                ⏹️ Stop Scanning
              </button>
            </div>

            {message && (
              <div className={`alert ${message.startsWith('✓') ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '20px', fontSize: '18px', textAlign: 'center' }}>
                {message}
              </div>
            )}
          </>
        )}

        {!selectedHall && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏛️</div>
            <p>Select a hall above to start scanning</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScannerHallPage;
