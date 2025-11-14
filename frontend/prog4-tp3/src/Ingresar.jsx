import React, { useState } from "react";
import { useAuth } from "./Auth.jsx";

export const Ingresar = () => {
  const { error, login } = useAuth();
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, contraseña);

    if (result.success) {
      setOpen(false);
      setEmail("");
      setContraseña("");
    }
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
            <a href="#close" aria-label="Close" className="close" onClick={handleCancel}></a>
            <h2>Iniciar Sesión</h2>
          </header>

          <form onSubmit={handleSubmit}>
            <fieldset>
              <label htmlFor="email">Email:</label>
              <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label htmlFor="contraseña">Contraseña:</label>
              <input type="password" name="contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />

              {error && <p style={{ color: "red" }}>{error}</p>}
            </fieldset>

            <footer>
              <div className="grid">
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
