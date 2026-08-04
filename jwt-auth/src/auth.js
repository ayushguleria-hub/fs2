// auth.js

export const fakeLogin = (username, password) => {
  if (username === "admin" && password === "admin123") {
    const payload = {
      username: "admin",
      role: "Student",
      exp: Date.now() + 60 * 60 * 1000, // 1 hour expiry
    };

    // Simulate a JWT token using Base64 encoding
    const token = btoa(JSON.stringify(payload));

    localStorage.setItem("token", token);

    return true;
  }

  return false;
};

// Remove token during logout
export const logout = () => {
  localStorage.removeItem("token");
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Decode stored token
export const decodeToken = () => {
  const token = getToken();

  if (!token) return null;

  return JSON.parse(atob(token));
};