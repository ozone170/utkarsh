import { useState } from 'react';

function ActivityFilters({ filters, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterUpdate = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      startDate: '',
      endDate: '',
      type: 'all'
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const setQuickDateRange = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const newFilters = {
      ...localFilters,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '20px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🔍 Filters & Date Range
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        {/* Activity Type Filter */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
            Activity Type:
          </label>
          <select
            value={localFilters.type}
            onChange={(e) => handleFilterUpdate('type', e.target.value)}
            className="input"
          >
            <option value="all">🔄 All Activities</option>
            <option value="hall">🏛️ Hall Movements</option>
            <option value="food">🍽️ Food Claims</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
            Start Date:
          </label>
          <input
            type="date"
            value={localFilters.startDate}
            onChange={(e) => handleFilterUpdate('startDate', e.target.value)}
            className="input"
          />
        </div>

        {/* End Date */}
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
            End Date:
          </label>
          <input
            type="date"
            value={localFilters.endDate}
            onChange={(e) => handleFilterUpdate('endDate', e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Quick Date Range Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <span style={{ color: '#6b7280', fontWeight: '600', alignSelf: 'center' }}>Quick ranges:</span>
        <button
          onClick={() => setQuickDateRange(1)}
          className="btn"
          style={{ 
            padding: '6px 12px', 
            fontSize: '12px', 
            background: '#f3f4f6', 
            color: '#374151',
            border: '1px solid #d1d5db'
          }}
        >
          Today
        </button>
        <button
          onClick={() => setQuickDateRange(7)}
          className="btn"
          style={{ 
            padding: '6px 12px', 
            fontSize: '12px', 
            background: '#f3f4f6', 
            color: '#374151',
            border: '1px solid #d1d5db'
          }}
        >
          Last 7 days
        </button>
        <button
          onClick={() => setQuickDateRange(30)}
          className="btn"
          style={{ 
            padding: '6px 12px', 
            fontSize: '12px', 
            background: '#f3f4f6', 
            color: '#374151',
            border: '1px solid #d1d5db'
          }}
        >
          Last 30 days
        </button>
        <button
          onClick={clearFilters}
          className="btn"
          style={{ 
            padding: '6px 12px', 
            fontSize: '12px', 
            background: '#ef4444', 
            color: 'white',
            border: 'none'
          }}
        >
          Clear All
        </button>
      </div>

      {/* Active Filters Display */}
      {(localFilters.startDate || localFilters.endDate || localFilters.type !== 'all') && (
        <div style={{ 
          padding: '12px', 
          background: 'rgba(59, 130, 246, 0.1)', 
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '600', marginBottom: '4px' }}>
            Active Filters:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {localFilters.type !== 'all' && (
              <span style={{ 
                background: '#3b82f6', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                Type: {localFilters.type === 'hall' ? 'Hall Movements' : 'Food Claims'}
              </span>
            )}
            {localFilters.startDate && (
              <span style={{ 
                background: '#10b981', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                From: {new Date(localFilters.startDate).toLocaleDateString()}
              </span>
            )}
            {localFilters.endDate && (
              <span style={{ 
                background: '#10b981', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                To: {new Date(localFilters.endDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityFilters;