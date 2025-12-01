import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from '../api/axios';

function ScannerHallPage() {
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState('');
  const [message, setMessage] = useState('');
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    fetchHalls();
  }, []);

  useEffect(() => {
    if (selectedHall) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } }
      );
      
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
      setScanner(html5QrcodeScanner);

      return () => {
        html5QrcodeScanner.clear();
      };
    }
  }, [selectedHall]);

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
      const response = await axios.post('/api/scan/hall', {
        eventId: decodedText,
        hallCode: selectedHall
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
      <h1>Hall Scanner</h1>
      
      <select
        value={selectedHall}
        onChange={(e) => setSelectedHall(e.target.value)}
        style={{ width: '100%', padding: '10px', margin: '10px 0', fontSize: '16px' }}
      >
        <option value="">Select Hall</option>
        {halls.map((hall) => (
          <option key={hall._id} value={hall.code}>
            {hall.name} ({hall.code})
          </option>
        ))}
      </select>

      {selectedHall && (
        <>
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
        </>
      )}
    </div>
  );
}

export default ScannerHallPage;
