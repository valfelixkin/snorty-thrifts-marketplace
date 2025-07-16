
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, setRedirectAfterLogin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If user is not authenticated, capture the current path for redirect after login
    if (!loading && !user) {
      const currentPath = location.pathname + location.search;
      // Don't capture auth-related routes
      if (!['/login', '/register'].includes(location.pathname)) {
        setRedirectAfterLogin(currentPath);
      }
    }
  }, [user, loading, location, setRedirectAfterLogin]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
