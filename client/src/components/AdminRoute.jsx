import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export default function AdminRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="page-loading" role="status">Restoring your session…</div>;
  }

  return (
    <ProtectedRoute>
      {user?.role === 'admin' ? children : <Navigate to="/" replace />}
    </ProtectedRoute>
  );
}
