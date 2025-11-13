import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. Importar PicoCSS (Estilos) y nuestro CSS
import "@picocss/pico";
import "./index.css";

// 2. Importar el "cerebro" (Contexto de Autenticación)
import { AuthProvider, AuthPage } from "./Auth.jsx";

// 3. Importar los componentes de página base
import { Layout } from "./Layout.jsx";
import { Home } from "./Home.jsx";

// --- ¡ACTUALIZACIÓN FINAL! ---
// Importamos TODOS nuestros componentes de página
import { Registro } from "./Registro.jsx";
import { Medicos } from "./Medicos.jsx";
import { Pacientes } from "./Pacientes.jsx";
import { Turnos } from "./Turnos.jsx"; // (¡Nuevo!)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Rutas Públicas */}
            <Route index element={<Home />} />
            <Route path="registro" element={<Registro />} />

            {/* Rutas Protegidas */}
            <Route
              path="pacientes"
              element={
                <AuthPage>
                  <Pacientes />
                </AuthPage>
              }
            />
            <Route
              path="medicos"
              element={
                <AuthPage>
                  <Medicos />
                </AuthPage>
              }
            />
            {/* --- ¡NUEVA RUTA! --- */}
            <Route
              path="turnos"
              element={
                <AuthPage>
                  <Turnos />
                </AuthPage>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
