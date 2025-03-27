
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthCheckProps {
  isAuthenticated?: boolean;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ isAuthenticated: propIsAuthenticated }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Use either the prop or the context value
  const isAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : !!user;
  
  useEffect(() => {
    // Only redirect after auth state is loaded and if not authenticated
    if (!loading && !isAuthenticated && process.env.NODE_ENV !== 'development') {
      // Small delay to prevent flash
      const timer = setTimeout(() => {
        navigate('/auth');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, navigate]);
  
  if (!isAuthenticated && !loading && process.env.NODE_ENV !== 'development') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">You need to sign in to access the dashboard</p>
        <Button onClick={() => navigate('/auth')}>
          Sign In / Register
        </Button>
      </div>
    );
  }
  
  // User is authenticated or loading, don't show anything
  return null;
};

export default AuthCheck;
