const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const saveResult = async (token, resultData) => {
  const res = await fetch(`${BASE_URL}/results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(resultData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to save marks');
  return data;
};

export const getExamResults = async (token, examId) => {
  const res = await fetch(`${BASE_URL}/results/exam/${examId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch exam results');
  return data;
};

export const getMyResults = async (token) => {
  const res = await fetch(`${BASE_URL}/results/my-results`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch your results');
  return data;
};

export const getReportCard = async (token, examId, studentId = '') => {
  let url = `${BASE_URL}/results/report-card/${examId}`;
  if (studentId) url += `?studentId=${studentId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch report card');
  return data;
};

export const getDashboardStats = async (token) => {
  const res = await fetch(`${BASE_URL}/results/dashboard-stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch dashboard stats');
  return data;
};
