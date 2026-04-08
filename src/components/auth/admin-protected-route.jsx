// src/components/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";

// This component protects admin routes by checking for a stored authentication key
const AdminProtectedRoute = ({ children }) => {
  // Retrieve the admin authentication key from localStorage
  const key = localStorage.getItem("x-admin-key");

  // If the key doesn't exist, redirect the user to the admin login page
  if (!key) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
