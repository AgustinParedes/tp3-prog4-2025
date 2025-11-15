/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
  }, [token, username]);

  const login = async (email, contraseña) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contraseña }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Error al iniciar sesión");
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
    const currentToken = token || localStorage.getItem("token");

    if (!currentToken) {
      logout();
      throw new Error("Sesión expirada. Por favor, inicie sesión de nuevo.");
    }

    const response = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${currentToken}` },
    });

    if (response.status === 401) {
      logout();
      throw new Error("Sesión inválida. Por favor, inicie sesión de nuevo.");
    }

    return response;
  };

  const value = {
    token,
    username,
    error,
    isAuthenticated: !!token || !!localStorage.getItem("token"),
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
