import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: JSX.Element;
  isAuthenticated: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  isAuthenticated,
}) => {
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
