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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Food Scanner</h1>
      <p>Scan student QR code to verify food eligibility</p>
      
      <div id="reader" style={{ marginTop: '20px' }}></div>
      
      {message && (
        <div style={{
          padding: '15px',
          marginTop: '20px',
          background: message.startsWith('✓') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${message.startsWith('✓') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default ScannerFoodPage;
