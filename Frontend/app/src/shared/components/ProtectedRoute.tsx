import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected children
  return <>{children}</>;
}
