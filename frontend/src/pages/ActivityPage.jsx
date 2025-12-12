import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import ActivityTimeline from '../components/Activity/ActivityTimeline';
import ActivityTable from '../components/Activity/ActivityTable';
import ActivityFilters from '../components/Activity/ActivityFilters';

function ActivityPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    if (userId) {
      fetchUserActivity();
      if (activeTab === 'timeline') {
        fetchUserTimeline();
      }
    }
  }, [userId, filters, pagination.page, activeTab]);

  const fetchUserActivity = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        type: filters.type
      });
      
      // FIX 3: Disable forced date filters - only add if they exist
      if (filters.startDate) params.append('start', filters.startDate);
      if (filters.endDate) params.append('end', filters.endDate);

      const response = await axios.get(`/api/admin/users/${userId}/activity?${params}`);
      // FIX 2: Ensure API response is read correctly
      const data = response.data; // Not response.data.data
      
      setUser({
        id: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        eventId: data.eventId,
        assignedHalls: data.assignedHalls,
        assignedHall: data.assignedHall, // NEW: Add assigned hall
        currentLocation: data.currentLocation,
        currentOrLastHall: data.currentOrLastHall // TASK A2: Add current or last hall
      });
      
      setActivities(data.activities);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      }));
    } catch (err) {
      console.error('Failed to fetch user activity:', err);
      if (err.response?.status === 404) {
        alert('User not found');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTimeline = async () => {
    try {
      const params = new URLSearchParams({
        type: filters.type
      });
      
      // FIX 3: Only add date filters if they exist
      if (filters.startDate) params.append('start', filters.startDate);
      if (filters.endDate) params.append('end', filters.endDate);

      const response = await axios.get(`/api/admin/users/${userId}/activity/timeline?${params}`);
      setTimeline(response.data.timeline);
    } catch (err) {
      console.error('Failed to fetch user timeline:', err);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'timeline' && timeline.length === 0) {
      fetchUserTimeline();
    }
  };

  const exportActivity = async () => {
    try {
      const params = new URLSearchParams({
        type: filters.type
      });
      
      if (filters.startDate) params.append('start', filters.startDate);
      if (filters.endDate) params.append('end', filters.endDate);

      const response = await axios.get(`/api/admin/users/${userId}/activity/export?${params}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${user?.name?.replace(/\s+/g, '_')}_activity.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export activity:', err);
      alert('Failed to export activity data');
    }
  };

  if (loading && !user) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: '20px' }}>
          <div style={{ textAlign: 'center', padding: '60px', color: 'white' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p>Loading user activity...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '36px', color: 'white', margin: 0 }}>
                📊 Activity Dashboard
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', fontSize: '16px' }}>
                Detailed activity tracking and analytics
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                onClick={exportActivity}
                className="btn"
                style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: 'white',
                  border: 'none'
                }}
              >
                📥 Export CSV
              </button>
              <button 
                onClick={() => navigate('/admin')} 
                className="btn" 
                style={{ background: 'white', color: 'var(--primary)' }}
              >
                ← Dashboard
              </button>
            </div>
          </div>

          {/* User Summary Card */}
          {user && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px' }}>{user.name}</h2>
                  <p style={{ margin: '4px 0', color: '#6b7280' }}>{user.email}</p>
                  
                  {/* FIX 4: Display Assigned Hall */}
                  {user.assignedHall && (
                    <p style={{ margin: '4px 0', color: '#374151', fontSize: '14px' }}>
                      <strong>Assigned Hall:</strong> {user.assignedHall.name} ({user.assignedHall.code})
                    </p>
                  )}
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    <span style={{ 
                      background: user.role === 'PARTICIPANT' ? '#3b82f6' : '#8b5cf6', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {user.role === 'PARTICIPANT' ? '🎓 Student' : `👤 ${user.role}`}
                    </span>
                    {user.eventId && (
                      <span style={{ 
                        background: '#10b981', 
                        color: 'white', 
                        padding: '4px 12px', 
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        ID: {user.eventId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Assigned Hall (for volunteers) */}
                {user.assignedHall && (
                  <div style={{ 
                    padding: '16px', 
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '12px',
                    color: 'white',
                    textAlign: 'center',
                    minWidth: '180px'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏛️</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                      Assigned Hall
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700' }}>
                      {user.assignedHall.name}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                      Code: {user.assignedHall.code}
                    </div>
                  </div>
                )}

                {/* TASK A2: Current/Last Hall - Only show for students, not volunteers */}
                {user.role !== 'VOLUNTEER' && user.currentOrLastHall && (
                  <div style={{ 
                    padding: '16px', 
                    background: user.currentOrLastHall.type === 'current' 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '12px',
                    color: 'white',
                    textAlign: 'center',
                    minWidth: '180px'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                      {user.currentOrLastHall.type === 'current' ? '📍' : '🕒'}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                      {user.currentOrLastHall.type === 'current' ? 'Currently In' : 'Last Hall'}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700' }}>
                      {user.currentOrLastHall.hallName}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                      {user.currentOrLastHall.type === 'current' 
                        ? `Since ${new Date(user.currentOrLastHall.at).toLocaleTimeString()}`
                        : `Last seen: ${new Date(user.currentOrLastHall.at).toLocaleTimeString()}`
                      }
                    </div>
                  </div>
                )}

                {/* TASK A2: Show message if no hall logs exist for students */}
                {user.role !== 'VOLUNTEER' && !user.currentOrLastHall && (
                  <div style={{ 
                    padding: '16px', 
                    background: '#6b7280',
                    borderRadius: '12px',
                    color: 'white',
                    textAlign: 'center',
                    minWidth: '180px'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>📋</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                      Hall Activity
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700' }}>
                      No hall logs found
                    </div>
                  </div>
                )}

                {/* Volunteer Activity Summary */}
                {user.role === 'VOLUNTEER' && (
                  <div style={{ 
                    padding: '16px', 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '12px',
                    color: 'white',
                    textAlign: 'center',
                    minWidth: '180px'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>📊</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                      Scanning Activity
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700' }}>
                      {activities.length} Actions
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                      Total scans performed
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <ActivityFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Tabs */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb' }}>
            <button
              onClick={() => handleTabChange('timeline')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'timeline' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'timeline' ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              📈 Timeline View
            </button>
            <button
              onClick={() => handleTabChange('table')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'table' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'table' ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              📋 Table View
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'timeline' ? (
          <ActivityTimeline 
            timeline={timeline}
            loading={loading}
          />
        ) : (
          <ActivityTable 
            activities={activities}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}

export default ActivityPage;