import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Check if user is authenticated by looking for auth token and user data
  const authToken = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user');
  
  // If no auth token or user data, redirect to login
  if (!authToken || !userData) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;