import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from '../api/axios';

function ScannerFoodPage() {
  const [message, setMessage] = useState('');
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } }
    );
    
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    setScanner(html5QrcodeScanner);

    return () => {
      html5QrcodeScanner.clear();
    };
  }, []);

  const onScanSuccess = async (decodedText) => {
    try {
      const response = await axios.post('/api/scan/food', {
        eventId: decodedText
      });
      setMessage(`✓ ${response.data.message}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`✗ ${err.response?.data?.message || 'Scan failed'}`);
    }
  };

  const onScanFailure = (error) => {
    // Ignore scan failures
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', color: 'white' }}>🍽️ Food Scanner</h1>
        <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
          Logout
        </button>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--dark)' }}>Scan for Food Distribution</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>
          Scan student QR code to verify food eligibility (one-time per day)
        </p>
        
        <div style={{ padding: '20px', background: 'var(--light)', borderRadius: '12px' }}>
          <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '16px' }}>
            📱 Scan student QR code
          </p>
          <div id="reader" style={{ borderRadius: '8px', overflow: 'hidden' }}></div>
        </div>
        
        {message && (
          <div className={`alert ${message.startsWith('✓') ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '20px', fontSize: '18px', textAlign: 'center' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScannerFoodPage;
