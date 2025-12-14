import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ScannerHallPage from '../pages/ScannerHallPage';
import ScannerFoodPage from '../pages/ScannerFoodPage';
import axios from '../api/axios';

function ScannerRouter() {
  const { user } = useAuth();
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
  const isFoodScanner = userProfile?.assignedHalls?.[0]?.name?.toLowerCase().includes('food') ||
                       userProfile?.assignedHalls?.[0]?.code?.toLowerCase().includes('food') ||
                       userProfile?.assignedHalls?.[0]?.name?.toLowerCase().includes('counter');

  // Return appropriate scanner component
  return isFoodScanner ? <ScannerFoodPage /> : <ScannerHallPage />;
}

export default ScannerRouter;