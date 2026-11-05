// AdminDashboard.js

import { logout } from "./auth";

function AdminDashboard({ onLogout }) {
  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin. You can manage users and system settings here.</p>
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

export default AdminDashboard;
