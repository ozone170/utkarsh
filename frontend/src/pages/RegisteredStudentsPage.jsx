import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

function RegisteredStudentsPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);

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

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', color: 'white' }}>🎓 Registered Students</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/admin')} className="btn" style={{ background: 'white', color: 'var(--primary)' }}>
            ← Back to Dashboard
          </button>
          <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="btn" style={{ background: 'white', color: 'var(--danger)' }}>
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
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Event ID</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Branch</th>
                    <th>Year</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td style={{ fontWeight: '600' }}>{student.name}</td>
                      <td><code style={{ background: 'var(--light)', padding: '4px 8px', borderRadius: '4px' }}>{student.eventId}</code></td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>{student.branch}</td>
                      <td>{student.year}</td>
                      <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => setEditingStudent(student)} 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '14px' }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(student._id)} 
                            className="btn" 
                            style={{ background: 'var(--danger)', color: 'white', padding: '6px 12px', fontSize: '14px' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RegisteredStudentsPage;
