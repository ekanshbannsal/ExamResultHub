import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ExamForm from '../components/ExamForm';
import { getExamById, createExam, updateExam } from '../api/examApi';

function ExamFormPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      loadExam();
    }
  }, [id]);

  const loadExam = async () => {
    try {
      setLoading(true);
      const data = await getExamById(user.token, id);
      setExamData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setSaving(true);
      setError('');
      if (isEditMode) {
        await updateExam(user.token, id, formData);
      } else {
        await createExam(user.token, formData);
      }
      navigate('/admin/exams');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading exam details...</div>;
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <div>
          <h2>{isEditMode ? 'Edit Examination' : 'Create New Examination'}</h2>
          <p className="subtitle">
            {isEditMode ? 'Update subjects and passing thresholds' : 'Set up exam name, semester, and subject marks'}
          </p>
        </div>
        <Link to="/admin/exams" className="btn-secondary">
          Cancel & Back
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <ExamForm
        initialData={examData}
        onSubmit={handleFormSubmit}
        buttonText={isEditMode ? 'Update Exam' : 'Create Exam'}
        isLoading={saving}
      />
    </div>
  );
}

export default ExamFormPage;
