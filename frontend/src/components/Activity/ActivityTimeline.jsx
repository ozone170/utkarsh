import { useState } from 'react';

function ActivityTimeline({ timeline, loading }) {
  const [selectedActivity, setSelectedActivity] = useState(null);

  const getActivityIcon = (type) => {
    switch (type) {
      // Student activities
      case 'hall-entry': return '�';
      case 'hall-exit': return '🚶';
      case 'food-claim': return '🍽️';
      // Volunteer scanning activities
      case 'scan-hall-entry': return '📱';
      case 'scan-hall-exit': return '📱';
      case 'scan-hall-movement': return '📱';
      case 'scan-food-allowed': return '✅';
      case 'scan-food-denied': return '❌';
      case 'hall-assignment': return '🏛️';
      case 'hall-unassignment': return '🚫';
      default: return '📍';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      // Student activities
      case 'hall-entry': return '#10b981';
      case 'hall-exit': return '#f59e0b';
      case 'food-claim': return '#8b5cf6';
      // Volunteer scanning activities
      case 'scan-hall-entry': return '#3b82f6';
      case 'scan-hall-exit': return '#f59e0b';
      case 'scan-hall-movement': return '#8b5cf6';
      case 'scan-food-allowed': return '#10b981';
      case 'scan-food-denied': return '#ef4444';
      case 'hall-assignment': return '#8b5cf6';
      case 'hall-unassignment': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatActivityMessage = (activity) => {
    switch (activity.type) {
      // Student activities
      case 'hall-entry':
        return `Entered ${activity.hallName}`;
      case 'hall-exit':
        return `Exited ${activity.hallName}`;
      case 'food-claim':
        return 'Food claimed';
      // Volunteer scanning activities - TASK 5: Volunteer timeline format
      case 'scan-hall-entry':
        return `Scanned student entry: ${activity.studentName || 'Unknown'}`;
      case 'scan-hall-exit':
        return `Scanned student exit: ${activity.studentName || 'Unknown'}`;
      case 'scan-hall-movement':
        return `Scanned student movement: ${activity.studentName || 'Unknown'}`;
      case 'scan-food-allowed':
        return `Approved food claim: ${activity.studentName || 'Unknown'}`;
      case 'scan-food-denied':
        return `Denied food claim: ${activity.studentName || 'Unknown'}`;
      case 'hall-assignment':
        return activity.description || 'Hall assignment changed';
      case 'hall-unassignment':
        return activity.description || 'Hall assignment removed';
      default:
        return activity.description || 'Unknown activity';
    }
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Loading timeline...</p>
        </div>
      </div>
    );
  }

  if (!timeline || timeline.length === 0) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📈</div>
          <h3 style={{ marginBottom: '8px' }}>No Activity Found</h3>
          <p>No activities found for the selected date range and filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: '24px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
        📈 Activity Timeline
        <span style={{ 
          background: '#e5e7eb', 
          color: '#6b7280', 
          padding: '4px 8px', 
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {timeline.reduce((total, day) => total + day.activities.length, 0)} activities
        </span>
      </h3>

      <div style={{ position: 'relative' }}>
        {timeline.map((day, dayIndex) => (
          <div key={day.date} style={{ marginBottom: '32px' }}>
            {/* Date Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                📅 {formatDate(day.date)}
              </div>
              <div style={{ 
                marginLeft: '12px',
                color: '#6b7280',
                fontSize: '14px'
              }}>
                {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
              </div>
            </div>

            {/* Activities for this day */}
            <div style={{ position: 'relative', paddingLeft: '40px' }}>
              {/* Timeline line */}
              {dayIndex < timeline.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '19px',
                  top: '0',
                  bottom: '-32px',
                  width: '2px',
                  background: 'linear-gradient(to bottom, #e5e7eb, transparent)',
                  zIndex: 1
                }} />
              )}

              {day.activities.map((activity, activityIndex) => (
                <div 
                  key={`${activity.logId}-${activity.type}-${activityIndex}`}
                  style={{ 
                    position: 'relative',
                    marginBottom: '16px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedActivity(selectedActivity?.logId === activity.logId ? null : activity)}
                >
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-30px',
                    top: '8px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: getActivityColor(activity.type),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    zIndex: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Activity card */}
                  <div style={{
                    background: selectedActivity?.logId === activity.logId ? '#f0f9ff' : 'white',
                    border: `2px solid ${selectedActivity?.logId === activity.logId ? '#0ea5e9' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    transition: 'all 0.2s',
                    boxShadow: selectedActivity?.logId === activity.logId ? '0 4px 12px rgba(14, 165, 233, 0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ 
                          fontWeight: '600', 
                          color: '#1f2937',
                          fontSize: '16px',
                          marginBottom: '4px'
                        }}>
                          {formatActivityMessage(activity)}
                        </div>
                        <div style={{ 
                          color: '#6b7280',
                          fontSize: '14px'
                        }}>
                          {formatTime(activity.time)}
                        </div>
                      </div>
                      
                      <div style={{ 
                        background: getActivityColor(activity.type),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {activity.type.replace('-', ' ').toUpperCase()}
                      </div>
                    </div>

                    {/* Additional details when expanded */}
                    {selectedActivity?.logId === activity.logId && (
                      <div style={{ 
                        marginTop: '12px',
                        padding: '12px',
                        background: 'rgba(59, 130, 246, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(59, 130, 246, 0.1)'
                      }}>
                        <div style={{ fontSize: '14px', color: '#374151' }}>
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Details:</strong>
                          </div>
                          <div style={{ display: 'grid', gap: '4px' }}>
                            {activity.hallName && (
                              <div>📍 <strong>Hall:</strong> {activity.hallName} ({activity.hallCode})</div>
                            )}
                            {activity.scanner && (
                              <div>👤 <strong>Scanned by:</strong> {activity.scanner} ({activity.scannerRole})</div>
                            )}
                            {activity.ipAddress && (
                              <div>🌐 <strong>IP Address:</strong> {activity.ipAddress}</div>
                            )}
                            <div>🕒 <strong>Full timestamp:</strong> {new Date(activity.time).toLocaleString()}</div>
                            {activity.details?.date && (
                              <div>📅 <strong>Date:</strong> {activity.details.date}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Click hint */}
                    <div style={{ 
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#9ca3af',
                      textAlign: 'center'
                    }}>
                      {selectedActivity?.logId === activity.logId ? '👆 Click to collapse' : '👆 Click for details'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {timeline.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📈</div>
          <p>No activities found for the selected filters.</p>
        </div>
      )}
    </div>
  );
}

export default ActivityTimeline;