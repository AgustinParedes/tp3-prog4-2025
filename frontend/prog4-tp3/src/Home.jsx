import { useAuth } from "./Auth.jsx";

export const Home = () => {
  const { isAuthenticated, username } = useAuth();

  return (
    <article>
      <h1>Bienvenido a Clínica App</h1>
      {isAuthenticated ? (
        <p>
          Hola de nuevo, <strong>{username}</strong>. Ya puedes administrar pacientes, médicos y turnos desde los enlaces de navegación.
        </p>
      ) : (
        <p>
          Por favor, <strong>inicia sesión</strong> para comenzar a gestionar la clínica, o <strong>regístrate</strong> si aún no tienes una cuenta.
        </p>
      )}
    </article>
  );
};
