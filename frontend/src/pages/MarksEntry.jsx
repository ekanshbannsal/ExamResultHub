import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExamResults, saveResult } from '../api/resultApi';
import { getStudents } from '../api/authApi';

function MarksEntry({ user }) {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const resData = await getExamResults(user.token, id);
      setExam(resData.exam);
      setResults(resData.results || []);

      const studentData = await getStudents(user.token, resData.exam.semester);
      setStudents(studentData);
      if (studentData.length > 0) {
        setSelectedStudent(studentData[0]._id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStudent && results.length > 0) {
      const existing = results.find(r => r.student && r.student._id === selectedStudent);
      if (existing) {
        const marksObj = {};
        existing.marks.forEach(m => {
          marksObj[m.subjectName] = m.marksObtained;
        });
        setMarks(marksObj);
      } else {
        setMarks({});
      }
    } else {
      setMarks({});
    }
  }, [selectedStudent, results]);

  const handleMarkChange = (subjectName, value) => {
    setMarks({
      ...marks,
      [subjectName]: value
    });
  };

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedStudent) {
      setError('Please select a student');
      return;
    }

    const marksArray = [];
    for (let sub of exam.subjects) {
      const val = marks[sub.name];
      if (val === undefined || val === '') {
        setError(`Please enter marks for ${sub.name}`);
        return;
      }
      const num = Number(val);
      if (num < 0 || num > sub.maxMarks) {
        setError(`Marks for ${sub.name} must be between 0 and ${sub.maxMarks}`);
        return;
      }
      marksArray.push({
        subjectName: sub.name,
        marksObtained: num
      });
    }

    try {
      setSaving(true);
      await saveResult(user.token, {
        studentId: selectedStudent,
        examId: id,
        marks: marksArray
      });

      setSuccess('Marks saved successfully!');
      setTimeout(() => setSuccess(''), 3000);

      const updatedResults = await getExamResults(user.token, id);
      setResults(updatedResults.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading examination and student data...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>Marks Evaluation: {exam?.name}</h2>
          <p className="subtitle">Semester {exam?.semester} | Total Subjects: {exam?.subjects?.length}</p>
        </div>
        <Link to="/admin/exams" className="btn-secondary">
          Back to Exams
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div className="marks-layout">
        <div className="card">
          <h3>Record Student Marks</h3>
          <p className="subtitle">Select a student and input marks for each subject</p>

          <form onSubmit={handleSaveMarks}>
            <div className="form-group">
              <label>Select Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
              >
                {students.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.rollNumber} - {st.name} ({st.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="marks-input-list">
              {exam?.subjects?.map((sub) => (
                <div key={sub._id || sub.name} className="mark-entry-item">
                  <div className="mark-subject-meta">
                    <strong>{sub.name}</strong>
                    <span className="text-muted">Max: {sub.maxMarks} | Pass: {sub.passMarks}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={sub.maxMarks}
                    placeholder="Marks"
                    value={marks[sub.name] !== undefined ? marks[sub.name] : ''}
                    onChange={(e) => handleMarkChange(sub.name, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '20px' }}>
              {saving ? 'Saving...' : 'Save & Calculate Result'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Class Results & Rank Sheet</h3>
          <p className="subtitle">Calculated grades and ties handled automatically</p>

          {results.length === 0 ? (
            <p className="empty-text">No results entered for this exam yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>%</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((res) => (
                    <tr key={res._id}>
                      <td>
                        <span className="rank-circle">{res.rank}</span>
                      </td>
                      <td>{res.student?.rollNumber}</td>
                      <td className="font-bold">{res.student?.name}</td>
                      <td>{res.totalMarks}</td>
                      <td>{res.percentage}%</td>
                      <td>
                        <span className={`badge ${res.grade === 'A+' ? 'badge-success' : 'badge-primary'}`}>
                          {res.grade}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${res.status === 'Pass' ? 'badge-success' : 'badge-danger'}`}>
                          {res.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/results/${exam._id}?studentId=${res.student?._id}`}
                          className="btn-sm btn-secondary"
                        >
                          Report Card
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarksEntry;
