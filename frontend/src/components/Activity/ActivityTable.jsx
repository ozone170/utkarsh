function ActivityTable({ activities, loading, pagination, onPageChange }) {
  const getActivityIcon = (type) => {
    switch (type) {
      // Student activities
      case 'hall-entry': return '🚪';
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
      // Volunteer scanning activities - TASK 6: Volunteer table format
      case 'scan-hall-entry':
        return `Scanned entry: ${activity.studentName || 'Unknown'}`;
      case 'scan-hall-exit':
        return `Scanned exit: ${activity.studentName || 'Unknown'}`;
      case 'scan-hall-movement':
        return `Scanned movement: ${activity.studentName || 'Unknown'}`;
      case 'scan-food-allowed':
        return `Food approved: ${activity.studentName || 'Unknown'}`;
      case 'scan-food-denied':
        return `Food denied: ${activity.studentName || 'Unknown'}`;
      case 'hall-assignment':
        return activity.description || 'Hall assignment changed';
      case 'hall-unassignment':
        return activity.description || 'Hall assignment removed';
      default:
        return activity.description || 'Unknown activity';
    }
  };

  const formatDateTime = (timeString) => {
    const date = new Date(timeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (pagination.page > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => onPageChange(pagination.page - 1)}
          className="btn"
          style={{ 
            padding: '8px 12px', 
            fontSize: '14px', 
            background: '#f3f4f6', 
            color: '#374151',
            border: '1px solid #d1d5db'
          }}
        >
          ← Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className="btn"
          style={{ 
            padding: '8px 12px', 
            fontSize: '14px', 
            background: i === pagination.page ? 'var(--primary)' : '#f3f4f6',
            color: i === pagination.page ? 'white' : '#374151',
            border: '1px solid #d1d5db'
          }}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (pagination.page < pagination.totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => onPageChange(pagination.page + 1)}
          className="btn"
          style={{ 
            padding: '8px 12px', 
            fontSize: '14px', 
            background: '#f3f4f6', 
            color: '#374151',
            border: '1px solid #d1d5db'
          }}
        >
          Next →
        </button>
      );
    }

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: '8px', 
        marginTop: '24px',
        flexWrap: 'wrap'
      }}>
        {pages}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Loading activity data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📋 Activity Table
          <span style={{ 
            background: '#e5e7eb', 
            color: '#6b7280', 
            padding: '4px 8px', 
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {pagination.total} total
          </span>
        </h3>
        
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Page {pagination.page} of {pagination.totalPages} 
          ({activities.length} of {pagination.total} activities)
        </div>
      </div>

      {activities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ marginBottom: '8px' }}>No Activities Found</h3>
          <p>No activities found for the selected date range and filters.</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Type
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Activity
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Hall
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Date & Time
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Scanner
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => {
                  const dateTime = formatDateTime(activity.time);
                  return (
                    <tr 
                      key={`${activity.logId}-${activity.type}-${index}`}
                      style={{ 
                        borderBottom: '1px solid #e5e7eb',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '20px' }}>
                            {getActivityIcon(activity.type)}
                          </span>
                          <span style={{ 
                            background: getActivityColor(activity.type),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            {activity.type.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontWeight: '500', color: '#1f2937' }}>
                        {formatActivityMessage(activity)}
                      </td>
                      <td style={{ padding: '12px', color: '#6b7280' }}>
                        {activity.hallName ? (
                          <div>
                            <div style={{ fontWeight: '500', color: '#1f2937' }}>
                              {activity.hallName}
                            </div>
                            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                              ({activity.hallCode})
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>N/A</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '500', color: '#1f2937' }}>
                            {dateTime.date}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {dateTime.time}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#6b7280' }}>
                        {activity.scanner ? (
                          <div>
                            <div style={{ fontWeight: '500', color: '#1f2937' }}>
                              {activity.scanner}
                            </div>
                            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                              {activity.scannerRole}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Unknown</span>
                        )}
                      </td>
                      <td style={{ padding: '12px', color: '#6b7280', fontFamily: 'monospace', fontSize: '13px' }}>
                        {activity.ipAddress || (
                          <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {renderPagination()}

          {/* Summary */}
          <div style={{ 
            marginTop: '20px',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              <strong>Summary:</strong> Showing {activities.length} of {pagination.total} activities
              {pagination.totalPages > 1 && ` across ${pagination.totalPages} pages`}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ActivityTable;