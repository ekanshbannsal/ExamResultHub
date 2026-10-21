import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getReportCard } from '../api/resultApi';

function ReportCard({ user }) {
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const studentIdParam = searchParams.get('studentId') || '';

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReport();
  }, [examId, studentIdParam]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await getReportCard(user.token, examId, studentIdParam);
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="loading-state">Generating official report card...</div>;
  }

  if (error) {
    return (
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="alert-error">{error}</div>
        <Link to={user.role === 'admin' ? '/admin/exams' : '/results'} className="btn-secondary" style={{ marginTop: '15px', display: 'inline-block' }}>
          Back to List
        </Link>
      </div>
    );
  }

  const examSubjects = report.exam?.subjects || [];
  const totalMaxMarks = examSubjects.reduce((acc, curr) => acc + curr.maxMarks, 0);

  return (
    <div className="container" style={{ maxWidth: '850px' }}>
      <div className="report-actions no-print">
        <Link to={user.role === 'admin' ? `/admin/exams/${examId}/marks` : '/results'} className="btn-secondary">
          ← Back
        </Link>
        <button onClick={handlePrint} className="btn-primary">
          🖨️ Print Report Card
        </button>
      </div>

      <div className="report-card printable-card">
        <div className="report-header">
          <div className="institute-title">EXAMINATION CELL & ACADEMIC BOARD</div>
          <div className="report-title">OFFICIAL GRADE REPORT CARD</div>
          <p className="report-subtitle">{report.exam?.name} (Semester {report.exam?.semester})</p>
        </div>

        <div className="student-profile-strip">
          <div className="profile-col">
            <span className="profile-label">Student Name:</span>
            <span className="profile-val">{report.student?.name}</span>
          </div>
          <div className="profile-col">
            <span className="profile-label">Roll Number:</span>
            <span className="profile-val">{report.student?.rollNumber}</span>
          </div>
          <div className="profile-col">
            <span className="profile-label">Semester:</span>
            <span className="profile-val">{report.student?.semester}</span>
          </div>
          <div className="profile-col">
            <span className="profile-label">Class Rank:</span>
            <span className="profile-val">Rank #{report.rank}</span>
          </div>
        </div>

        <table className="custom-table report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Subject</th>
              <th>Max Marks</th>
              <th>Pass Marks</th>
              <th>Marks Scored</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {report.marks?.map((m, idx) => {
              const subConfig = examSubjects.find(s => s.name === m.subjectName) || {};
              const isSubPass = subConfig.passMarks !== undefined ? m.marksObtained >= subConfig.passMarks : true;
              return (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td className="font-bold">{m.subjectName}</td>
                  <td>{subConfig.maxMarks || '-'}</td>
                  <td>{subConfig.passMarks || '-'}</td>
                  <td className="font-bold">{m.marksObtained}</td>
                  <td>
                    <span className={`badge ${isSubPass ? 'badge-success' : 'badge-danger'}`}>
                      {isSubPass ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="report-summary-box">
          <div className="summary-metric">
            <span className="label">Grand Total</span>
            <span className="value">{report.totalMarks} / {totalMaxMarks}</span>
          </div>
          <div className="summary-metric">
            <span className="label">Percentage</span>
            <span className="value">{report.percentage}%</span>
          </div>
          <div className="summary-metric">
            <span className="label">Letter Grade</span>
            <span className="value">{report.grade}</span>
          </div>
          <div className="summary-metric">
            <span className="label">Final Result</span>
            <span className={`value status-${report.status.toLowerCase()}`}>{report.status}</span>
          </div>
        </div>

        <div className="report-signatures">
          <div className="signature-box">
            <div className="signature-line"></div>
            <span>Prepared By</span>
          </div>
          <div className="signature-box">
            <div className="signature-line"></div>
            <span>Controller of Examinations</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportCard;
