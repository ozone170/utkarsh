import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import axios from '../api/axios';

function RegisteredStudentsPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingCard, setViewingCard] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.eventId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/students/${editingStudent._id}`, {
        name: editingStudent.name,
        email: editingStudent.email,
        phone: editingStudent.phone,
        branch: editingStudent.branch,
        year: editingStudent.year
      });
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update student');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/admin/students/${studentId}`);
        fetchStudents();
      } catch (err) {
        alert('Failed to delete student');
      }
    }
  };

  const downloadStudentCard = async (student) => {
    const cardElement = cardRefs.current[student._id];
    if (!cardElement) return;

    try {
      // Convert SVG to Canvas
      const svgElement = cardElement.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = svgUrl;
        });
        
        const qrCanvas = document.createElement('canvas');
        qrCanvas.width = 180;
        qrCanvas.height = 180;
        const ctx = qrCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 180, 180);
        
        const qrWrapper = svgElement.parentElement;
        const originalSVG = svgElement;
        qrWrapper.replaceChild(qrCanvas, svgElement);
        
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(cardElement, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true
        });
        
        qrWrapper.replaceChild(originalSVG, qrCanvas);
        URL.revokeObjectURL(svgUrl);
        
        const link = document.createElement('a');
        link.download = `${student.name.replace(/\s+/g, '_')}_ID_Card.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download ID card. Please try again.');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', color: 'white' }}>🎓 Registered Students</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/admin')} className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
            ← Back to Dashboard
          </button>
          <button onClick={() => { localStorage.clear(); navigate('/'); }} className="btn" style={{ background: 'white', color: 'var(--danger)' }}>
            Logout
          </button>
        </div>
      </div>

      <div className="card">
        {editingStudent && (
          <form onSubmit={handleUpdateStudent} style={{ marginBottom: '24px', padding: '20px', background: '#fff3cd', borderRadius: '12px', border: '2px solid #ffc107' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>Edit Student Details</h3>
              <button type="button" onClick={() => setEditingStudent(null)} className="btn" style={{ background: 'transparent', color: 'var(--danger)' }}>
                ✕ Cancel
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Name"
                value={editingStudent.name}
                onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                required
                className="input"
              />
              <input
                type="email"
                placeholder="Email"
                value={editingStudent.email}
                onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                required
                className="input"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <input
                type="tel"
                placeholder="Phone"
                value={editingStudent.phone}
                onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                required
                className="input"
              />
              <input
                type="text"
                placeholder="Branch"
                value={editingStudent.branch}
                onChange={(e) => setEditingStudent({ ...editingStudent, branch: e.target.value })}
                required
                className="input"
              />
            </div>
            <select
              value={editingStudent.year}
              onChange={(e) => setEditingStudent({ ...editingStudent, year: parseInt(e.target.value) })}
              required
              className="input"
              style={{ marginBottom: '12px' }}
            >
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            <button type="submit" className="btn btn-primary">Update Student</button>
          </form>
        )}

        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="🔍 Search by name, email, event ID, or branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
            style={{ fontSize: '16px' }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            Loading...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎓</div>
            <p>{searchTerm ? 'No students found matching your search' : 'No students registered yet'}</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--light)', borderRadius: '8px' }}>
              <strong>Total Students: {filteredStudents.length}</strong>
              {searchTerm && <span style={{ marginLeft: '12px', color: 'var(--text-light)' }}>(filtered from {students.length})</span>}
            </div>

            {/* Card View */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {filteredStudents.map((student) => (
                <div key={student._id} style={{ position: 'relative' }}>
                  {/* ID Card */}
                  <div 
                    ref={el => cardRefs.current[student._id] = el}
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      borderRadius: '16px', 
                      padding: '24px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Decorative Elements */}
                    <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                      <h3 style={{ fontSize: '24px', color: 'white', marginBottom: '4px', fontWeight: '700' }}>UTKARSH</h3>
                      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>Fresher Event 2024</p>
                    </div>

                    {/* Content */}
                    <div style={{ background: 'rgba(255,255,255,0.95)', padding: '20px', borderRadius: '12px', position: 'relative', zIndex: 1 }}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '6px' }}>{student.name}</div>
                        <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '600' }}>
                          ID: {student.eventId}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gap: '10px', marginBottom: '16px', fontSize: '13px' }}>
                        <div><strong>Email:</strong> {student.email}</div>
                        <div><strong>Phone:</strong> {student.phone}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div><strong>Branch:</strong> {student.branch}</div>
                          <div><strong>Year:</strong> {student.year}</div>
                        </div>
                        <div><strong>Registered:</strong> {new Date(student.createdAt).toLocaleDateString()}</div>
                      </div>

                      {/* QR Code */}
                      <div style={{ textAlign: 'center', padding: '12px', background: 'white', borderRadius: '8px', border: '3px solid #667eea' }}>
                        <QRCodeSVG value={student.eventId} size={120} level="H" />
                        <div style={{ marginTop: '8px', fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>SCAN FOR ENTRY</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => downloadStudentCard(student)} 
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '10px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      ⬇️ Download
                    </button>
                    <button 
                      onClick={() => setEditingStudent(student)} 
                      className="btn btn-secondary" 
                      style={{ flex: 1, padding: '10px', fontSize: '14px' }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteStudent(student._id)} 
                      className="btn" 
                      style={{ background: 'var(--danger)', color: 'white', padding: '10px', fontSize: '14px' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RegisteredStudentsPage;
