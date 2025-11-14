import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./Auth.jsx";
import { Ingresar } from "./Ingresar.jsx";

export const Layout = () => {
  // Traemos 'username' del contexto para mostrarlo
  const { isAuthenticated, logout, username } = useAuth();

  return (
    <main className="container">
      <nav>
        <ul>
          <li>
            <Link to="/">
              <strong>Clínica App</strong>
            </Link>
          </li>
        </ul>
        {/* Mostramos estos enlaces solo si el usuario está autenticado */}
        {isAuthenticated && (
          <ul>
            <li>
              <Link to="/pacientes">Pacientes</Link>
            </li>
            <li>
              <Link to="/medicos">Médicos</Link>
            </li>
            <li>
              <Link to="/turnos">Turnos</Link>
            </li>
          </ul>
        )}
        <ul>
          {isAuthenticated ? (
            <>
              {/* Mostramos el nombre de usuario */}
              <li>
                <span role="button" className="contrast outline">
                  Hola, {username}
                </span>
              </li>
              <li>
                <button className="secondary" onClick={() => logout()}>
                  Salir
                </button>
              </li>
            </>
          ) : (
            <>
              {/* Mostramos Registro e Ingresar si NO está autenticado */}
              <li>
                <Link to="/registro" role="button" className="contrast">
                  Registrarse
                </Link>
              </li>
              <li>
                <Ingresar />
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* El Outlet renderiza la ruta hija (Home, Pacientes, etc.) */}
      <Outlet />
    </main>
  );
};
