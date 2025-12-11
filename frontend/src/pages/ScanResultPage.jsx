import { useLocation, useNavigate } from 'react-router-dom';

function ScanResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentDetails, scanResult, scanType } = location.state || {};

  if (!studentDetails || !scanResult) {
    return (
      <div className="container" style={{ paddingTop: '60px' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <h2>No scan data available</h2>
          <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ marginTop: '20px' }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '60px' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Student Details */}
        <div style={{ padding: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: 'white', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div className="scanner-result-icon">👤</div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h2 className="card-title" style={{ color: 'white', margin: 0, marginBottom: '4px' }}>{studentDetails.name}</h2>
              <p style={{ opacity: 0.9, fontSize: '16px', margin: 0 }}>Event ID: {studentDetails.eventId}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Email</div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{studentDetails.email}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Phone</div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{studentDetails.phone}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Branch</div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{studentDetails.branch}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Year</div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{studentDetails.year}</div>
            </div>
          </div>
        </div>

        {/* Scan Result */}
        <div style={{ 
          padding: '24px', 
          background: scanResult.success ? '#d1fae5' : '#fee2e2', 
          borderRadius: '12px', 
          border: `3px solid ${scanResult.success ? '#10b981' : '#ef4444'}`, 
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <div className="scanner-result-icon" style={{ margin: '0 auto 16px auto' }}>
            {scanType === 'hall' && scanResult.status === 'entry' && '🚪'}
            {scanType === 'hall' && scanResult.status === 'exit' && '👋'}
            {scanType === 'hall' && scanResult.status === 'movement' && '🔄'}
            {scanType === 'food' && scanResult.success && '✅'}
            {scanType === 'food' && !scanResult.success && '❌'}
          </div>
          <div>
            <h3 style={{ fontSize: '24px', color: scanResult.success ? '#065f46' : '#991b1b', marginBottom: '8px' }}>
              {scanType === 'hall' && scanResult.status === 'entry' && 'Entry Recorded'}
              {scanType === 'hall' && scanResult.status === 'exit' && 'Exit Recorded'}
              {scanType === 'hall' && scanResult.status === 'movement' && 'Hall Movement'}
              {scanType === 'food' && scanResult.success && 'Food Approved'}
              {scanType === 'food' && !scanResult.success && 'Food Already Claimed'}
            </h3>
            <p className="scanner-message" style={{ 
              color: scanResult.success ? '#047857' : '#b91c1c', 
              margin: '8px 0',
              background: 'rgba(255,255,255,0.5)',
              borderRadius: '8px'
            }}>
              {scanResult.message}
            </p>
          </div>
          {scanType === 'hall' && scanResult.status === 'movement' && (
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <span style={{ fontWeight: '700', color: '#047857', fontSize: '18px' }}>{scanResult.from}</span>
                <span style={{ fontSize: '24px' }}>→</span>
                <span style={{ fontWeight: '700', color: '#047857', fontSize: '18px' }}>{scanResult.to}</span>
              </div>
            </div>
          )}
          {scanType === 'food' && !scanResult.success && scanResult.claimedAt && (
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: '#991b1b', marginBottom: '4px', fontWeight: '600' }}>
                ⏰ Previously Claimed At
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#7f1d1d' }}>
                {new Date(scanResult.claimedAt).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-primary scanner-button touchable" 
            style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
            }}
          >
            📱 Scan Another
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScanResultPage;
