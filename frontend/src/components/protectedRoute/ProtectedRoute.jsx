// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';

export function ProtectedRoute({ children, rolRequerido }) {
  const { user } = useSession();

  if (!user)    // sin sesión
    return 
<Navigate to="/login" replace />;

  if (rolRequerido && user.rol !== rolRequerido)
    return <Navigate to="/unauthorized" replace />;

  return children; // OK, renderiza
}
