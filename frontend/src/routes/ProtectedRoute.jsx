import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  console.log(isAuthenticated)

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

