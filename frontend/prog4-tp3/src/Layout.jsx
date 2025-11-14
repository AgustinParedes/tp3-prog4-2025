import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./Auth.jsx";
import { Ingresar } from "./Ingresar.jsx";

export const Layout = () => {
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

      <Outlet />
    </main>
  );
};
