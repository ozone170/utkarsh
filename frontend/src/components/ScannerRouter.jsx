import { useEffect, useState } from 'react';
import ScannerHallPage from '../pages/ScannerHallPage';
import ScannerFoodPage from '../pages/ScannerFoodPage';
import axios from '../api/axios';

function ScannerRouter() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setUserProfile(response.data);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--primary)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Loading scanner...</p>
        </div>
      </div>
    );
  }

  // Determine scanner type based on user assignment
  const assignedHall = userProfile?.assignedHalls?.[0];
  const hallName = assignedHall?.name?.toLowerCase() || '';
  const hallCode = assignedHall?.code?.toLowerCase() || '';
  
  const isFoodScanner = hallName.includes('food') || 
                       hallCode.includes('food') || 
                       hallName.includes('counter');

  // Debug logging
  console.log('ScannerRouter Debug:', {
    userProfile,
    assignedHall,
    hallName,
    hallCode,
    isFoodScanner
  });

  // Temporary: Show selection UI for debugging
  if (!userProfile || !assignedHall) {
    console.log('�️ No aissignment found, showing Hall Scanner');
    return <ScannerHallPage />;
  }

  // Show debug selection temporarily
  return (
    <div style={{ 
      padding: '20px', 
      background: 'var(--primary)', 
      minHeight: '100vh',
      color: 'white'
    }}>
      <div className="container">
        <h1>🔧 Scanner Debug Mode</h1>
        <div className="card" style={{ marginBottom: '20px', background: '#667eea' }}>
          <h3>User Assignment Info:</h3>
          <p><strong>Hall Name:</strong> {assignedHall.name}</p>
          <p><strong>Hall Code:</strong> {assignedHall.code}</p>
          <p><strong>Detection Result:</strong> {isFoodScanner ? '🍽️ Food Scanner' : '🏛️ Hall Scanner'}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => window.location.href = '/scanner/food'}
            className="btn btn-primary"
            style={{ background: '#f59e0b' }}
          >
            🍽️ Force Food Scanner
          </button>
          <button 
            onClick={() => window.location.href = '/scanner/hall'}
            className="btn btn-primary"
            style={{ background: '#667eea' }}
          >
            🏛️ Force Hall Scanner
          </button>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h4>Auto-detected Scanner:</h4>
          {isFoodScanner ? <ScannerFoodPage /> : <ScannerHallPage />}
        </div>
      </div>
    </div>
  );
}

export default ScannerRouter;