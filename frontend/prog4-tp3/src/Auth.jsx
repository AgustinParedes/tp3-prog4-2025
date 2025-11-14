import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [error, setError] = useState(null);

  const login = async (email, contraseña) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ email, contraseña }),
      });

      const data = await response.json();

      if (!response.ok && response.status === 400) {
        throw new Error(data.error);
      }
      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      setToken(data.token);
      setUsername(data.username);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setError(null);

    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  const fetchAuth = async (url, options = {}) => {
    if (!token) {
      throw new Error("No esta iniciada la session");
    }

    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
  };

  const value = {
    token,
    username,
    error,
    isAuthenticated: !!token,
    login,
    logout,
    fetchAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthPage = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <h2>Debes iniciar sesión para ver esta pagina.</h2>;
  }

  return children;
};
// eslint-disable-next-line react-refresh/only-export-components
export const AuthRol = ({ rol, children }) => {
  return null;
};
