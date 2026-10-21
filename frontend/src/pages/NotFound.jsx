import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '60px' }}>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
        <h1 style={{ fontSize: '64px', margin: '0', color: '#e53e3e' }}>404</h1>
        <h2>Page Not Found</h2>
        <p className="subtitle">The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '15px' }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
