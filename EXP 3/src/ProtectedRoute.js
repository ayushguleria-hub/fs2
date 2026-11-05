// ProtectedRoute.js

import { Navigate } from "react-router-dom";
import { decodeToken } from "./auth";

function ProtectedRoute({ children, allowedRoles }) {
  const currentUser = decodeToken();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;