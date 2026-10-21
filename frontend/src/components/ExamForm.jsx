import { useState, useEffect } from 'react';

function ExamForm({ initialData, onSubmit, buttonText, isLoading }) {
  const [name, setName] = useState('');
  const [semester, setSemester] = useState(1);
  const [subjects, setSubjects] = useState([
    { name: '', maxMarks: 100, passMarks: 40 }
  ]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSemester(initialData.semester || 1);
      if (initialData.subjects && initialData.subjects.length > 0) {
        setSubjects(initialData.subjects);
      }
    }
  }, [initialData]);

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: '', maxMarks: 100, passMarks: 40 }]);
  };

  const removeSubject = (index) => {
    if (subjects.length === 1) {
      setError('Exam must have at least one subject');
      return;
    }
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide an exam name');
      return;
    }

    for (let sub of subjects) {
      if (!sub.name.trim()) {
        setError('All subjects must have a name');
        return;
      }
      if (Number(sub.maxMarks) <= 0 || Number(sub.passMarks) < 0) {
        setError('Marks must be valid positive numbers');
        return;
      }
      if (Number(sub.passMarks) > Number(sub.maxMarks)) {
        setError(`Pass marks cannot exceed max marks for ${sub.name}`);
        return;
      }
    }

    onSubmit({
      name: name.trim(),
      semester: Number(semester),
      subjects: subjects.map(s => ({
        name: s.name.trim(),
        maxMarks: Number(s.maxMarks),
        passMarks: Number(s.passMarks)
      }))
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      {error && <div className="alert-error">{error}</div>}

      <div className="form-group">
        <label>Exam Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mid-Sem Examination 2026"
          required
        />
      </div>

      <div className="form-group">
        <label>Semester</label>
        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      <div className="form-section-title">
        <h3>Subjects Configuration</h3>
        <button type="button" onClick={addSubject} className="btn-secondary btn-sm">
          + Add Subject
        </button>
      </div>

      {subjects.map((sub, index) => (
        <div key={index} className="subject-row">
          <input
            type="text"
            placeholder="Subject Name"
            value={sub.name}
            onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Max Marks"
            value={sub.maxMarks}
            onChange={(e) => handleSubjectChange(index, 'maxMarks', e.target.value)}
            min="1"
            required
          />
          <input
            type="number"
            placeholder="Pass Marks"
            value={sub.passMarks}
            onChange={(e) => handleSubjectChange(index, 'passMarks', e.target.value)}
            min="0"
            required
          />
          <button
            type="button"
            onClick={() => removeSubject(index)}
            className="btn-danger btn-sm"
          >
            Remove
          </button>
        </div>
      ))}

      <button type="submit" disabled={isLoading} className="btn-primary" style={{ marginTop: '20px' }}>
        {isLoading ? 'Saving...' : buttonText || 'Save Exam'}
      </button>
    </form>
  );
}

export default ExamForm;
