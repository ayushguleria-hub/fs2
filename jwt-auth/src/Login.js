// Login.js

import { useState } from "react";
import { fakeLogin } from "./auth";
import "./App.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (fakeLogin(username, password)) {
      onLogin();
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="auth-card">
      <div className="card-header">
        <p className="eyebrow">Secure access</p>
        <h2>JWT Authentication</h2>
        <p>Sign in with your demo credentials to continue.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          Username
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label className="field">
          Password
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="primary-button" type="submit">
          Login
        </button>
      </form>

      <p className="helper-text">Demo login: admin / admin123</p>
    </div>
  );
}

export default Login;