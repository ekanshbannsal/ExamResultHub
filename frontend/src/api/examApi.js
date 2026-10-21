const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getExams = async (token) => {
  const res = await fetch(`${BASE_URL}/exams`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch exams');
  return data;
};

export const getExamById = async (token, id) => {
  const res = await fetch(`${BASE_URL}/exams/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch exam');
  return data;
};

export const createExam = async (token, examData) => {
  const res = await fetch(`${BASE_URL}/exams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(examData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create exam');
  return data;
};

export const updateExam = async (token, id, examData) => {
  const res = await fetch(`${BASE_URL}/exams/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(examData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update exam');
  return data;
};

export const deleteExam = async (token, id) => {
  const res = await fetch(`${BASE_URL}/exams/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete exam');
  return data;
};

export const togglePublish = async (token, id) => {
  const res = await fetch(`${BASE_URL}/exams/${id}/toggle-publish`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update exam status');
  return data;
};
