import { createContext, useContext, useState } from "react";

// 1. Creamos el Contexto
const AuthContext = createContext(null);

// 2. Creamos un Hook personalizado para usar el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Creamos el Proveedor del contexto
export const AuthProvider = ({ children }) => {
  // Estado para el token y el usuario.
  // Leemos de localStorage para mantener la sesión si se refresca la página.
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [error, setError] = useState(null);

  // --- FUNCIÓN DE LOGIN (Adaptada a nuestro Backend) ---
  const login = async (email, contraseña) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Adaptado: Enviamos 'email' y 'contraseña' (con ñ)
        body: JSON.stringify({ email, contraseña }),
      });

      const data = await response.json();

      // Adaptado: Nuestro backend devuelve 'error' en caso de 400
      if (!response.ok && response.status === 400) {
        throw new Error(data.error);
      }
      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guardamos el token y el nombre de usuario en el estado
      setToken(data.token);
      setUsername(data.username);

      // Guardamos en localStorage para persistir la sesión
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };

  // --- FUNCIÓN DE LOGOUT ---
  const logout = () => {
    setToken(null);
    setUsername(null);
    setError(null);

    // Limpiamos el localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  // --- FUNCIÓN DE FETCH AUTENTICADO (Lógica del Profesor) ---
  const fetchAuth = async (url, options = {}) => {
    if (!token) {
      throw new Error("No esta iniciada la session");
    }

    // Inyecta el token en las cabeceras de la petición
    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
  };

  // 5. Valores que compartirá el proveedor
  const value = {
    token,
    username,
    error,
    isAuthenticated: !!token, // !!token es true si token no es null/undefined
    login,
    logout,
    fetchAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 6. Componente de Ruta Protegida (Lógica del Profesor)
export const AuthPage = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <h2>Debes iniciar sesión para ver esta pagina.</h2>;
  }

  return children;
};

// 7. Stub de AuthRol (Lógica del Profesor)
// Lo incluimos para que 'main.jsx' no de error al importarlo,
// pero como no usamos roles, simplemente devolvemos null.
// eslint-disable-next-line react-refresh/only-export-components
export const AuthRol = ({ rol, children }) => {
  return null;
};
