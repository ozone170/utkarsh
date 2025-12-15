import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import StudentFormModal from '../components/StudentFormModal';
import { useAuth } from '../context/AuthContext';

function RegisteredStudentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if user is admin (has full access) or volunteer (view-only)
  const isAdmin = user?.role === 'ADMIN';
  const isVolunteer = user?.role === 'VOLUNTEER';
  
  // 🛠️ FIX: Safe initial state
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [bulkDownloadProgress, setBulkDownloadProgress] = useState({ isDownloading: false, current: 0, total: 0 });
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const cardRefs = useRef({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/students');
      
      // 🛠️ FIX: Normalize student data to prevent undefined field access
      const normalizedStudents = (response.data || []).map(student => ({
        ...student,
        name: student.name || "",
        email: student.email || "",
        eventId: student.eventId || "",
        branch: student.branch || student.program || "MBA", // Fallback to program or MBA
        program: student.program || "MBA",
        section: student.section || "",
        phone: student.phone || "",
        gender: student.gender || "",
        year: student.year || 1
      }));
      
      setStudents(normalizedStudents);
    } catch (err) {
      console.error('Failed to fetch students', err);
      // 🛠️ FIX: Set empty array on error to prevent crashes
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (formData) => {
    const response = await axios.post('/api/admin/students', formData);
    fetchStudents(); // Refresh the list
    return response.data;
  };

  // 🛠️ FIX: Defensive filtering to handle undefined fields with error resilience
  const filteredStudents = (() => {
    try {
      if (!Array.isArray(students)) return [];
      
      return students.filter(student => {
        try {
          // Create a searchable text string with safe field access
          const searchableText = `
            ${student?.name || ""}
            ${student?.email || ""}
            ${student?.eventId || ""}
            ${student?.branch || ""}
            ${student?.program || ""}
            ${student?.section || ""}
            ${student?.phone || ""}
          `.toLowerCase();
          
          return searchableText.includes((searchTerm || "").toLowerCase());
        } catch (filterError) {
          console.warn('Error filtering student:', student, filterError);
          return false; // Exclude problematic students from results
        }
      });
    } catch (error) {
      console.error('Error in student filtering:', error);
      return []; // Return empty array if filtering completely fails
    }
  })();

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/students/${editingStudent._id}`, {
        name: editingStudent.name,
        email: editingStudent.email,
        phone: editingStudent.phone
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
        // 🛠️ FIX: Safe filename generation
        const safeName = (student.name || student.eventId || 'Student').replace(/\s+/g, '_');
        link.download = `${safeName}_ID_Card.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download ID card. Please try again.');
    }
  };

  const downloadAllIDCards = async () => {
    if (filteredStudents.length === 0) {
      alert('No students to download ID cards for.');
      return;
    }

    if (!window.confirm(`This will download ${filteredStudents.length} ID cards as a ZIP file. This may take a few minutes. Continue?`)) {
      return;
    }

    setBulkDownloadProgress({ isDownloading: true, current: 0, total: filteredStudents.length });

    try {
      // Dynamically import JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      let successCount = 0;
      let failedStudents = [];

      for (let i = 0; i < filteredStudents.length; i++) {
        const student = filteredStudents[i];
        setBulkDownloadProgress({ isDownloading: true, current: i + 1, total: filteredStudents.length });

        try {
          const cardElement = cardRefs.current[student._id];
          if (!cardElement) {
            failedStudents.push(student.name || student.eventId);
            continue;
          }

          // Convert SVG to Canvas (same logic as single download)
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
            
            // Convert canvas to blob and add to zip
            const imageBlob = await new Promise(resolve => {
              canvas.toBlob(resolve, 'image/png', 0.9);
            });
            
            const safeName = (student.name || student.eventId || 'Student').replace(/\s+/g, '_');
            zip.file(`${safeName}_ID_Card.png`, imageBlob);
            successCount++;
          }
        } catch (err) {
          console.error(`Failed to process ID card for ${student.name}:`, err);
          failedStudents.push(student.name || student.eventId);
        }

        // Small delay to prevent browser freezing
        if (i % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      if (successCount === 0) {
        alert('Failed to generate any ID cards. Please try again.');
        return;
      }

      // Generate and download ZIP file
      setBulkDownloadProgress({ isDownloading: true, current: filteredStudents.length, total: filteredStudents.length });
      
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `UTKARSH_Student_ID_Cards_${new Date().toISOString().split('T')[0]}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);

      // Show completion message
      let message = `Successfully downloaded ${successCount} ID cards!`;
      if (failedStudents.length > 0) {
        message += `\n\nFailed to generate ${failedStudents.length} cards for: ${failedStudents.slice(0, 5).join(', ')}`;
        if (failedStudents.length > 5) {
          message += ` and ${failedStudents.length - 5} others`;
        }
      }
      alert(message);

    } catch (err) {
      console.error('Bulk download failed:', err);
      alert('Failed to create ZIP file. Please try again.');
    } finally {
      setBulkDownloadProgress({ isDownloading: false, current: 0, total: 0 });
    }
  };

  const handleSelectStudent = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s._id)));
    }
  };

  const downloadSelectedIDCards = async () => {
    const selectedStudentsList = filteredStudents.filter(s => selectedStudents.has(s._id));
    
    if (selectedStudentsList.length === 0) {
      alert('Please select students to download ID cards for.');
      return;
    }

    if (!window.confirm(`This will download ${selectedStudentsList.length} selected ID cards as a ZIP file. Continue?`)) {
      return;
    }

    setBulkDownloadProgress({ isDownloading: true, current: 0, total: selectedStudentsList.length });

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      let successCount = 0;
      let failedStudents = [];

      for (let i = 0; i < selectedStudentsList.length; i++) {
        const student = selectedStudentsList[i];
        setBulkDownloadProgress({ isDownloading: true, current: i + 1, total: selectedStudentsList.length });

        try {
          const cardElement = cardRefs.current[student._id];
          if (!cardElement) {
            failedStudents.push(student.name || student.eventId);
            continue;
          }

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
            
            const imageBlob = await new Promise(resolve => {
              canvas.toBlob(resolve, 'image/png', 0.9);
            });
            
            const safeName = (student.name || student.eventId || 'Student').replace(/\s+/g, '_');
            zip.file(`${safeName}_ID_Card.png`, imageBlob);
            successCount++;
          }
        } catch (err) {
          console.error(`Failed to process ID card for ${student.name}:`, err);
          failedStudents.push(student.name || student.eventId);
        }

        if (i % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      if (successCount === 0) {
        alert('Failed to generate any ID cards. Please try again.');
        return;
      }

      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `UTKARSH_Selected_ID_Cards_${new Date().toISOString().split('T')[0]}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);

      let message = `Successfully downloaded ${successCount} selected ID cards!`;
      if (failedStudents.length > 0) {
        message += `\n\nFailed to generate ${failedStudents.length} cards.`;
      }
      alert(message);

      // Clear selection after successful download
      setSelectedStudents(new Set());

    } catch (err) {
      console.error('Selected download failed:', err);
      alert('Failed to create ZIP file. Please try again.');
    } finally {
      setBulkDownloadProgress({ isDownloading: false, current: 0, total: 0 });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '36px', color: 'white' }}>🎓 Registered Students</h1>
            {isVolunteer && (
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', fontSize: '16px' }}>
                View student information and access activity data
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Only show Add Student button for admins */}
            {isAdmin && (
              <>
                <button 
                  onClick={() => setShowAddModal(true)} 
                  className="btn btn-primary"
                  style={{ 
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  ➕ Add Student
                </button>
                <button 
                  onClick={downloadSelectedIDCards} 
                  className="btn"
                  style={{ 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                  }}
                  disabled={loading || selectedStudents.size === 0}
                >
                  📋 Download Selected ({selectedStudents.size})
                </button>
                <button 
                  onClick={downloadAllIDCards} 
                  className="btn"
                  style={{ 
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                  }}
                  disabled={loading || filteredStudents.length === 0}
                >
                  📦 Download All ID Cards
                </button>
              </>
            )}
            <button 
              onClick={() => navigate(isAdmin ? '/admin' : '/scanner')} 
              className="btn" 
              style={{ background: 'white', color: 'var(--primary)' }}
            >
              ← {isAdmin ? 'Dashboard' : 'Back to Scan'}
            </button>
          </div>
        </div>

        {/* Only show Add Student modal for admins */}
        {isAdmin && (
          <StudentFormModal 
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddStudent}
          />
        )}

      <div className="card">
        {/* Only show edit form for admins */}
        {isAdmin && editingStudent && (
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
            <input
              type="tel"
              placeholder="Phone"
              value={editingStudent.phone}
              onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
              required
              className="input"
              style={{ marginBottom: '12px' }}
            />
            <div style={{ 
              padding: '12px', 
              background: 'rgba(14, 165, 255, 0.1)', 
              border: '1px solid rgba(14, 165, 255, 0.3)',
              borderRadius: '8px',
              color: '#0ea5ff',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span>🎓 Branch: MBA</span>
              <span>📚 Year: 1st Year</span>
            </div>
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

        {/* Bulk Download Progress */}
        {bulkDownloadProgress.isDownloading && (
          <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '32px' }}>📦</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Generating ID Cards...</h3>
                <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>
                  Processing {bulkDownloadProgress.current} of {bulkDownloadProgress.total} students
                </p>
                <div style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  borderRadius: '10px', 
                  height: '8px', 
                  marginTop: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    background: 'white', 
                    height: '100%', 
                    borderRadius: '10px',
                    width: `${(bulkDownloadProgress.current / bulkDownloadProgress.total) * 100}%`,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {Math.round((bulkDownloadProgress.current / bulkDownloadProgress.total) * 100)}%
              </div>
            </div>
          </div>
        )}

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <strong>Total Students: {filteredStudents.length}</strong>
                  {searchTerm && <span style={{ marginLeft: '12px', color: 'var(--text-light)' }}>(filtered from {students.length})</span>}
                </div>
                {isAdmin && filteredStudents.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                        onChange={handleSelectAll}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <span style={{ fontWeight: '600' }}>
                        {selectedStudents.size === filteredStudents.length ? 'Deselect All' : 'Select All'}
                      </span>
                    </label>
                    {selectedStudents.size > 0 && (
                      <span style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {selectedStudents.size} selected
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Card View */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
              {filteredStudents.map((student) => (
                <div key={student._id} style={{ position: 'relative' }}>
                  {/* Selection Checkbox - Only for admins */}
                  {isAdmin && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '8px', 
                      left: '8px', 
                      zIndex: 10,
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: '50%',
                      padding: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedStudents.has(student._id)}
                        onChange={() => handleSelectStudent(student._id)}
                        style={{ 
                          transform: 'scale(1.3)',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  )}
                  
                  {/* ID Card */}
                  <div 
                    ref={el => cardRefs.current[student._id] = el}
                    style={{ 
                      backgroundImage: 'url(/card.jpg)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      borderRadius: '16px', 
                      padding: '24px',
                      boxShadow: selectedStudents.has(student._id) ? '0 10px 40px rgba(59, 130, 246, 0.4)' : '0 10px 30px rgba(0,0,0,0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                      border: selectedStudents.has(student._id) ? '3px solid #3b82f6' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Overlay for better text readability */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)',
                      borderRadius: '16px'
                    }}></div>

                    {/* Decorative Elements */}
                    <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', zIndex: 1 }}></div>
                    <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', zIndex: 1 }}></div>

                    {/* Header with Logo */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '12px',
                      marginBottom: '20px', 
                      position: 'relative', 
                      zIndex: 2 
                    }}>
                      <img 
                        src="/logo.jpg" 
                        alt="UTKARSH Logo" 
                        style={{ 
                          height: '50px', 
                          width: 'auto', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                        }}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <div style={{ textAlign: 'left' }}>
                        <h3 style={{ fontSize: '24px', color: 'white', margin: 0, fontWeight: '700', lineHeight: '1.2' }}>UTKARSH</h3>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.95)', margin: 0, fontWeight: '600' }}>MBA Fresher Event 2025</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.75)', 
                      backdropFilter: 'blur(10px)',
                      padding: '20px', 
                      borderRadius: '12px', 
                      position: 'relative', 
                      zIndex: 2,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '6px' }}>
                          {student.name || 'Unnamed Student'}
                        </div>
                        <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '600' }}>
                          ID: {student.eventId || 'No ID'}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gap: '10px', marginBottom: '16px', fontSize: '13px', color: '#1f2937' }}>
                        <div><strong>Email:</strong> {student.email || 'No email'}</div>
                        <div><strong>Phone:</strong> {student.phone || 'No phone'}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div><strong>Program:</strong> {student.program || 'MBA'}</div>
                          <div><strong>Year:</strong> {student.year ? `${student.year}${student.year === 1 ? 'st' : student.year === 2 ? 'nd' : student.year === 3 ? 'rd' : 'th'} Year` : '1st Year'}</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div><strong>Gender:</strong> {student.gender || 'N/A'}</div>
                          <div><strong>Section:</strong> {student.section || 'N/A'}</div>
                        </div>
                        <div><strong>Registered:</strong> {new Date(student.createdAt).toLocaleDateString()}</div>
                      </div>

                      {/* QR Code */}
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '12px', 
                        background: 'rgba(255, 255, 255, 0.9)', 
                        backdropFilter: 'blur(5px)',
                        borderRadius: '8px', 
                        border: '3px solid #667eea' 
                      }}>
                        <QRCodeSVG value={student.eventId} size={120} level="H" />
                        <div style={{ marginTop: '8px', fontSize: '11px', color: '#4b5563', fontWeight: '600' }}>SCAN FOR ENTRY</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Different for Admin vs Volunteer */}
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => navigate(`/admin/activity/${student._id}`)} 
                      className="btn" 
                      style={{ 
                        flex: isVolunteer ? 1 : 1, 
                        padding: '10px', 
                        fontSize: '14px', 
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                        color: 'white',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px' 
                      }}
                    >
                      📊 Activity
                    </button>
                    <button 
                      onClick={() => downloadStudentCard(student)} 
                      className="btn btn-primary" 
                      style={{ 
                        flex: isVolunteer ? 1 : 1, 
                        padding: '10px', 
                        fontSize: '14px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px' 
                      }}
                    >
                      ⬇️ Download
                    </button>
                    
                    {/* Admin-only buttons */}
                    {isAdmin && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}

export default RegisteredStudentsPage;
