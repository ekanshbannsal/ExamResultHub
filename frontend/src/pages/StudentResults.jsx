import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyResults } from '../api/resultApi';

function StudentResults({ user }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await getMyResults(user.token);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading your results...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>My Examination Results</h2>
          <p className="subtitle">
            Student: {user.name} | Roll No: {user.rollNumber} | Semester: {user.semester}
          </p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {results.length === 0 ? (
        <div className="card empty-card">
          <p>No published examination results available for your account yet.</p>
          <span className="text-muted">Results will appear here once the exam cell publishes them.</span>
        </div>
      ) : (
        <div className="results-grid">
          {results.map((item) => (
            <div key={item._id} className="card result-card">
              <div className="result-card-header">
                <h3>{item.exam?.name}</h3>
                <span className={`badge ${item.status === 'Pass' ? 'badge-success' : 'badge-danger'}`}>
                  {item.status}
                </span>
              </div>

              <div className="result-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Score</span>
                  <span className="summary-val">{item.totalMarks}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Percentage</span>
                  <span className="summary-val">{item.percentage}%</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Grade</span>
                  <span className="summary-val grade-badge">{item.grade}</span>
                </div>
              </div>

              <div className="result-card-footer">
                <Link to={`/results/${item.exam?._id}`} className="btn-primary" style={{ textAlign: 'center', width: '100%' }}>
                  View Full Report Card
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentResults;
