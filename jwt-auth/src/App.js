// App.js

import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import { getToken } from "./auth";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!getToken());

  return (
    <div className="app-shell">
      {loggedIn ? (
        <ProtectedRoute>
          <Dashboard onLogout={() => setLoggedIn(false)} />
        </ProtectedRoute>
      ) : (
        <Login onLogin={() => setLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;