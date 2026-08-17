// ViewerDashboard.js

import { logout } from "./auth";

function ViewerDashboard({ onLogout }) {
  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Viewer Dashboard</h2>
      <p>Welcome, Viewer. You can browse content and access view-only resources here.</p>
      <div style={{ marginTop: "24px" }}>
        <button
          onClick={() => {
            logout();
            onLogout();
          }}
          style={{ padding: "10px 18px" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default ViewerDashboard;
