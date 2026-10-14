import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function navLinkClass({ isActive }) {
  return `nav-link${isActive ? ' nav-link-active' : ''}`;
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="Gather home">
          <span className="brand-mark" aria-hidden="true">g</span>
          <span>gather<span className="brand-period">.</span></span>
        </Link>

        <div className="nav-links">
          <NavLink className={navLinkClass} to="/">Discover</NavLink>
          {isAuthenticated && (
            <NavLink className={navLinkClass} to="/account">My account</NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink className={navLinkClass} to="/admin">Admin</NavLink>
          )}
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="nav-greeting">Hi, {user.name.split(' ')[0]}</span>
              <button className="button button-small button-outline" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="nav-login" to="/login">Log in</Link>
              <Link className="button button-small button-dark" to="/register">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
