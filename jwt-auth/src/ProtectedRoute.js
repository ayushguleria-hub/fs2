// ProtectedRoute.js

import { getToken } from "./auth";

function ProtectedRoute({ children }) {

  const token = getToken();

  if (!token) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Access Denied</h2>
        <p>Please login first.</p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;