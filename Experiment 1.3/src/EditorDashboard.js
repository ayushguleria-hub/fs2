// EditorDashboard.js

import { logout } from "./auth";

function EditorDashboard({ onLogout }) {
  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Editor Dashboard</h2>
      <p>Welcome, Editor. You can create and update content from this area.</p>
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

export default EditorDashboard;
