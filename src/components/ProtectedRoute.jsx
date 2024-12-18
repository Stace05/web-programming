import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userEmail = localStorage.getItem('userEmail');

  if (!userEmail) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
