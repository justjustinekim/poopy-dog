
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AuthCheckProps {
  isAuthenticated: boolean;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  
  if (!isAuthenticated && process.env.NODE_ENV !== 'development') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-6">You need to sign in to access the dashboard</p>
        <Button onClick={() => navigate('/profile')}>
          Sign In / Register
        </Button>
      </div>
    );
  }
  
  return null;
};

export default AuthCheck;
