import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';

interface AuthRedirectProps {
  children: ReactNode;
}

// Component to redirect authenticated users away from login page
const AuthRedirect = ({ children }: AuthRedirectProps) => {
  // Check if user is already authenticated
  const authToken = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user');
  
  // If authenticated, redirect to dashboard
  if (authToken && userData) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If not authenticated, show the login page
  return <>{children}</>;
};

export default AuthRedirect;