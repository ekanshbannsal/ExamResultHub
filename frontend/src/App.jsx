import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ExamList from './pages/ExamList';
import ExamFormPage from './pages/ExamFormPage';
import MarksEntry from './pages/MarksEntry';
import StudentResults from './pages/StudentResults';
import ReportCard from './pages/ReportCard';
import NotFound from './pages/NotFound';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <div className="app-layout">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.role === 'admin' ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/results" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/results'} replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/register"
            element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/results'} replace />
              ) : (
                <Register onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} role="admin">
                <AdminDashboard user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/exams"
            element={
              <ProtectedRoute user={user} role="admin">
                <ExamList user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/exams/new"
            element={
              <ProtectedRoute user={user} role="admin">
                <ExamFormPage user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/exams/:id/edit"
            element={
              <ProtectedRoute user={user} role="admin">
                <ExamFormPage user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/exams/:id/marks"
            element={
              <ProtectedRoute user={user} role="admin">
                <MarksEntry user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/results"
            element={
              <ProtectedRoute user={user} role="student">
                <StudentResults user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/results/:examId"
            element={
              <ProtectedRoute user={user}>
                <ReportCard user={user} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
