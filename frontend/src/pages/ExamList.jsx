import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExams, deleteExam, togglePublish } from '../api/examApi';

function ExamList({ user }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await getExams(user.token);
      setExams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const updated = await togglePublish(user.token, id);
      setExams(exams.map(e => e._id === id ? updated : e));
      setActionMsg(`Exam "${updated.name}" is now ${updated.isPublished ? 'Published' : 'Unpublished'}`);
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete exam "${name}"? All associated marks will also be deleted.`)) {
      return;
    }
    try {
      await deleteExam(user.token, id);
      setExams(exams.filter(e => e._id !== id));
      setActionMsg(`Exam "${name}" deleted successfully`);
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading exams...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>Manage Examinations</h2>
          <p className="subtitle">Create, configure subjects, enter marks, and publish results</p>
        </div>
        <Link to="/admin/exams/new" className="btn-primary">
          + Add New Exam
        </Link>
      </div>

      {actionMsg && <div className="alert-success">{actionMsg}</div>}
      {error && <div className="alert-error">{error}</div>}

      {exams.length === 0 ? (
        <div className="card empty-card">
          <p>No exams created yet.</p>
          <Link to="/admin/exams/new" className="btn-primary" style={{ marginTop: '10px', display: 'inline-block' }}>
            Create First Exam
          </Link>
        </div>
      ) : (
        <div className="table-responsive card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Semester</th>
                <th>Subjects</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam._id}>
                  <td className="font-bold">{exam.name}</td>
                  <td>Semester {exam.semester}</td>
                  <td>
                    <span className="badge badge-info">
                      {exam.subjects ? exam.subjects.length : 0} Subjects
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${exam.isPublished ? 'badge-success' : 'badge-warning'}`}>
                      {exam.isPublished ? 'Published' : 'Draft (Unpublished)'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => handleTogglePublish(exam._id)}
                        className={`btn-sm ${exam.isPublished ? 'btn-secondary' : 'btn-success'}`}
                      >
                        {exam.isPublished ? 'Unpublish' : 'Publish'}
                      </button>

                      <Link to={`/admin/exams/${exam._id}/marks`} className="btn-sm btn-primary">
                        Enter Marks
                      </Link>

                      <Link to={`/admin/exams/${exam._id}/edit`} className="btn-sm btn-secondary">
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(exam._id, exam.name)}
                        className="btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExamList;
