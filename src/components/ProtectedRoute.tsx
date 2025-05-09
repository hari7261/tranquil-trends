import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    if (!isAuthenticated) {
      // Store the path user was trying to access
      localStorage.setItem("lastPath", location.pathname);
      
      // Show a toast notification
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;