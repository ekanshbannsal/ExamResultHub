import { NavLink, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-brand">
          ExamResultHub
        </NavLink>

        <div className="nav-links">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/admin/exams" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Manage Exams
                  </NavLink>
                  <NavLink to="/admin/exams/new" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    + Create Exam
                  </NavLink>
                </>
              ) : (
                <NavLink to="/results" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  My Results
                </NavLink>
              )}

              <div className="user-info">
                <span className="user-badge">{user.role}</span>
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
