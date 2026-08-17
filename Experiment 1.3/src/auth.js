import { users } from "./users";

export const fakeLogin = (username, password) => {

  const user = users.find(
    (u) =>
      u.username === username &&
      u.password === password
  );
  if (user) {

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      exp: Date.now() + 3600000,
    };

    const token = btoa(JSON.stringify(payload));

    localStorage.setItem("token", token);

    return true;
  }

  return false;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const decodeToken = () => {
  const token = getToken();

  if (!token) return null;

  try {
    const decoded = JSON.parse(atob(token));

    if (decoded.exp && Date.now() > decoded.exp) {
      localStorage.removeItem("token");
      return null;
    }

    return decoded;
  } catch (error) {
    localStorage.removeItem("token");
    return null;
  }
};