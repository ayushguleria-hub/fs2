import { decodeToken, logout } from "./auth";
import { users } from "./users";

function Dashboard({ onLogout }) {

  const token = decodeToken();

  const currentUser = users.find(
    (u) => u.id === token.id
  );

  return (

    <div style={{ textAlign: "center", marginTop: "100px" }}>

      <h2>Dashboard</h2>

      <h3>Welcome, {currentUser.name}</h3>

      <hr />

      <p><strong>Employee ID:</strong> {currentUser.id}</p>

      <p><strong>Username:</strong> {currentUser.username}</p>

      <p><strong>Designation:</strong> {currentUser.designation}</p>

      <p><strong>Department:</strong> {currentUser.department}</p>

      <p><strong>Email:</strong> {currentUser.email}</p>

      <p><strong>Phone:</strong> {currentUser.phone}</p>

      <br />

      <button
        onClick={() => {
          logout();
          onLogout();
        }}
      >
        Logout
      </button>

    </div>

  );
}

export default Dashboard;