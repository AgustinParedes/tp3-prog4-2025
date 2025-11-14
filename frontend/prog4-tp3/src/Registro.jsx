import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Auth.jsx"; // Lo importamos para el login automático

// Lógica adaptada de 'CrearUsuario.jsx' del profesor
export const Registro = () => {
  const navigate = useNavigate();
  // Traemos la función de login del contexto
  const { login } = useAuth();
  const [errores, setErrores] = useState(null);

  // Estado para los campos del formulario
  const [values, setValues] = useState({
    nombre: "",
    email: "",
    contraseña: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    // 1. Validaciones del Frontend (Requerimiento del profesor)
    if (values.contraseña.length < 8) {
      setErrores([
        {
          path: "contraseña",
          msg: "La contraseña debe tener al menos 8 caracteres.",
        },
      ]);
      return;
    }
    // (Puedes añadir más validaciones aquí)

    try {
      // Usamos fetch() normal, NO fetchAuth() porque aún no hay token
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          // Si el backend nos da errores de validación, los mostramos
          return setErrores(data.errores);
        }
        // Usamos 'message' (de nuestro backend) o un error genérico
        throw new Error(data.message || "Error al crear el usuario.");
      }

      // ¡Éxito!
      window.alert("¡Usuario registrado con éxito!");

      // 2. Auto-Login: Después de registrarse, iniciamos sesión
      const loginResult = await login(values.email, values.contraseña);

      if (loginResult.success) {
        // 3. Redirigir a la página de inicio (Home)
        navigate("/");
      } else {
        // Si el login falla (raro, pero puede pasar), lo mandamos a la home
        navigate("/");
      }
    } catch (error) {
      // Capturamos cualquier error de red o el 'throw' de arriba
      setErrores([{ msg: error.message }]);
    }
  };

  // Función para mostrar los errores de un campo específico
  // (Lógica del profesor)
  const getError = (path) => {
    if (!errores) return null;
    const error = errores.find((e) => e.path === path);
    return error ? <small style={{ color: "red" }}>{error.msg}</small> : null;
  };

  return (
    <article>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              required
              value={values.nombre}
              onChange={(e) => setValues({ ...values, nombre: e.target.value })}
              // Marcamos como inválido si hay un error para 'nombre'
              aria-invalid={errores && errores.some((e) => e.path === "nombre")}
            />
            {getError("nombre")}
          </label>

          <label>
            Email
            <input type="email" required value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} aria-invalid={errores && errores.some((e) => e.path === "email")} />
            {getError("email")}
          </label>

          <label>
            Contraseña
            <input type="password" required value={values.contraseña} onChange={(e) => setValues({ ...values, contraseña: e.target.value })} aria-invalid={errores && errores.some((e) => e.path === "contraseña")} />
            {getError("contraseña")}
          </label>
        </fieldset>

        {/* Mostramos errores generales (ej: de red) */}
        {errores && !errores.some((e) => e.path) && <p style={{ color: "red" }}>{errores.map((e) => e.msg).join(", ")}</p>}

        <input type="submit" value="Registrarse" />
      </form>
    </article>
  );
};
