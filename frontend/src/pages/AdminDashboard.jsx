import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../api/resultApi';

function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats(user.token);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading dashboard statistics...</div>;
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>Exam Cell Dashboard</h2>
          <p className="subtitle">Overview of exams, performance metrics, and results</p>
        </div>
        <div className="action-buttons">
          <Link to="/admin/exams/new" className="btn-primary">
            + New Exam
          </Link>
          <Link to="/admin/exams" className="btn-secondary">
            View All Exams
          </Link>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Overall Pass Rate</h4>
          <div className="metric-value">{stats.passPercentage}%</div>
          <span className="metric-sub">
            {stats.passCount} Passed / {stats.failCount} Failed
          </span>
        </div>

        <div className="metric-card">
          <h4>Total Exams</h4>
          <div className="metric-value">{stats.totalExams}</div>
          <span className="metric-sub">{stats.publishedExams} Published to Students</span>
        </div>

        <div className="metric-card">
          <h4>Registered Students</h4>
          <div className="metric-value">{stats.totalStudents}</div>
          <span className="metric-sub">Across all semesters</span>
        </div>

        <div className="metric-card">
          <h4>Evaluated Results</h4>
          <div className="metric-value">{stats.totalResults}</div>
          <span className="metric-sub">Marks sheets entered</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Subject-wise Performance</h3>
          <p className="subtitle">Average marks and highest scores achieved</p>

          {stats.subjectStats.length === 0 ? (
            <p className="empty-text">No subject results recorded yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Average Score</th>
                    <th>Highest Score</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.subjectStats.map((sub, idx) => (
                    <tr key={idx}>
                      <td className="font-bold">{sub.subject}</td>
                      <td>
                        <span className="badge badge-info">{sub.average}</span>
                      </td>
                      <td>
                        <span className="badge badge-success">{sub.highest}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Top 5 Meritorious Students</h3>
          <p className="subtitle">Highest scorers across published exams</p>

          {stats.topStudents.length === 0 ? (
            <p className="empty-text">No student rankings available yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th>Roll No</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topStudents.map((item, idx) => (
                    <tr key={item._id}>
                      <td>
                        <span className="rank-circle">{idx + 1}</span>
                      </td>
                      <td className="font-bold">{item.student?.name || 'N/A'}</td>
                      <td>{item.student?.rollNumber || 'N/A'}</td>
                      <td className="font-bold">{item.percentage}%</td>
                      <td>
                        <span className={`badge ${item.grade === 'A+' ? 'badge-success' : 'badge-primary'}`}>
                          {item.grade}
                        </span>
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

export default AdminDashboard;
