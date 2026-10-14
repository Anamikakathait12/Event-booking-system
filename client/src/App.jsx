import { Navigate, Route, Routes } from 'react-router-dom';
import AdminRoute from './components/AdminRoute.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Account from './pages/Account.jsx';
import Admin from './pages/Admin.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="page-loading" role="status">Restoring your session…</div>;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function App() {
  const { sessionError } = useAuth();

  return (
    <div className="app-shell">
      <Navbar />
      {sessionError && <div className="session-notice" role="alert">{sessionError}</div>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="site-footer">
        <span>gather<span className="brand-period">.</span></span>
        <span>GOOD THINGS HAPPEN TOGETHER</span>
        <span>© 2026 GATHER</span>
      </footer>
    </div>
  );
}
