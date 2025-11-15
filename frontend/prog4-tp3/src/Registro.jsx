import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Auth.jsx";

export const Registro = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errores, setErrores] = useState(null);

  const [values, setValues] = useState({
    nombre: "",
    email: "",
    contraseña: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    if (values.contraseña.length < 8) {
      setErrores([
        {
          path: "contraseña",
          msg: "La contraseña debe tener al menos 8 caracteres.",
        },
      ]);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          return setErrores(data.errores);
        }
        throw new Error(data.message || "Error al crear el usuario.");
      }

      window.alert("¡Usuario registrado con éxito!");

      const loginResult = await login(values.email, values.contraseña);

      if (loginResult.success) {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrores([{ msg: error.message }]);
    }
  };

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
            <input required value={values.nombre} onChange={(e) => setValues({ ...values, nombre: e.target.value })} aria-invalid={errores && errores.some((e) => e.path === "nombre")} />
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

        {errores && !errores.some((e) => e.path) && <p style={{ color: "red" }}>{errores.map((e) => e.msg).join(", ")}</p>}

        <input type="submit" value="Registrarse" />
      </form>
    </article>
  );
};
