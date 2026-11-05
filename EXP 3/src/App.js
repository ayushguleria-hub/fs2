// App.js

import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./Unauthorized";
import AdminDashboard from "./AdminDashboard";
import EditorDashboard from "./EditorDashboard";
import ViewerDashboard from "./ViewerDashboard";
import { decodeToken } from "./auth";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!decodeToken());

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard onLogout={() => setLoggedIn(false)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDashboard onLogout={() => setLoggedIn(false)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor"
            element={
              <ProtectedRoute allowedRoles={["Editor"]}>
                <EditorDashboard onLogout={() => setLoggedIn(false)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewer"
            element={
              <ProtectedRoute allowedRoles={["Viewer"]}>
                <ViewerDashboard onLogout={() => setLoggedIn(false)} />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to={loggedIn ? "/dashboard" : "/login"} replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;