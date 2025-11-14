import React from "react";

// Siguiendo la lógica del profesor, Home.jsx es un componente simple
// que no maneja lógica de autenticación (eso se hace en Layout.jsx e Ingresar.jsx)

export const Home = () => {
  return (
    <article>
      <hgroup>
        <h1>Sistema de Gestión de Turnos</h1>
        <h2>Pacientes, Médicos y Turnos</h2>
      </hgroup>
      <p>
        Bienvenido al proyecto. Por favor, utiliza el botón <strong>"Ingresar"</strong> en la navegación para iniciar sesión y acceder a las herramientas.
      </p>
      <p>
        Si no tienes una cuenta, puedes crear una en la página de <strong>Registro</strong> (que añadiremos en el siguiente paso).
      </p>
    </article>
  );
};
