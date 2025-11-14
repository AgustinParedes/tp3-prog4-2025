import React, { useState } from "react";
import { useAuth } from "./Auth.jsx";

// Este componente sigue la lógica del profesor (usando <dialog>)
// pero está ADAPTADO a nuestro backend (usa email/contraseña)

export const Ingresar = () => {
  const { error, login } = useAuth(); // Obtenemos la función login y el estado de error
  const [open, setOpen] = useState(false);

  // --- ADAPTACIÓN ---
  // El profesor usaba 'username' y 'password'.
  // Nosotros usamos 'email' y 'contraseña' (con ñ).
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Llamamos a la función login de nuestro AuthContext
    const result = await login(email, contraseña);

    if (result.success) {
      // Si el login es exitoso, cerramos el modal y limpiamos los campos
      setOpen(false);
      setEmail("");
      setContraseña("");
    }
    // Si falla, el 'error' en el AuthContext se actualizará
    // y se mostrará en el <p> de abajo.
  };

  const handleCancel = () => {
    setOpen(false);
    setEmail("");
    setContraseña("");
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Ingresar</button>

      <dialog open={open}>
        <article>
          <header>
            {/* Botón 'X' para cerrar el modal */}
            <a href="#close" aria-label="Close" className="close" onClick={handleCancel}></a>
            <h2>Iniciar Sesión</h2>
          </header>

          <form onSubmit={handleSubmit}>
            <fieldset>
              <label htmlFor="email">Email:</label>
              <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label htmlFor="contraseña">Contraseña:</label>
              <input type="password" name="contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
              {/* Mostramos el error si existe */}
              {error && <p style={{ color: "red" }}>{error}</p>}
            </fieldset>

            <footer>
              <div className="grid">
                {/* Usamos <button> en lugar de <input type="button"> */}
                <button type="button" className="secondary" onClick={handleCancel}>
                  Cancelar
                </button>
                <button type="submit">Ingresar</button>
              </div>
            </footer>
          </form>
        </article>
      </dialog>
    </>
  );
};
