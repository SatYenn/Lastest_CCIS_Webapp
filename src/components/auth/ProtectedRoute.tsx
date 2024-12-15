import React, { Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../ui/loading-spinner';
import ErrorBoundary from '../ErrorBoundary';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const FallbackComponent = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <p className="text-red-500 mb-4">Something went wrong loading this page.</p>
    <button 
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Retry
    </button>
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['client', 'admin'] 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    // Handle case where user object is undefined
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect admin to admin dashboard, clients to client dashboard
    const redirectPath = user.role === 'admin' ? '/admin' : '/client';
    return <Navigate to={redirectPath} replace />;
  }

  // Wrap children in both ErrorBoundary and Suspense
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <Suspense 
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
