// Dashboard.js

import { decodeToken, logout } from "./auth";
import "./App.css";

function Dashboard({ onLogout }) {
  const user = decodeToken();

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h2>Dashboard</h2>
          <p className="helper-text">Your session is active and ready.</p>
        </div>
        <button
          className="secondary-button"
          onClick={() => {
            logout();
            onLogout();
          }}
        >
          Logout
        </button>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <strong>Username</strong>
          <span>{user.username}</span>
        </div>
        <div className="info-card">
          <strong>Role</strong>
          <span>{user.role}</span>
        </div>
      </div>

      <p className="helper-text">
        This demo shows a simple JWT-style authentication flow with a cleaner interface.
      </p>
    </div>
  );
}

export default Dashboard;