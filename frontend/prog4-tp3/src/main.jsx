import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "@picocss/pico";
import "./index.css";

import { AuthProvider, AuthPage } from "./Auth.jsx";

import { Layout } from "./Layout.jsx";
import { Home } from "./Home.jsx";

import { Registro } from "./Registro.jsx";
import { Medicos } from "./Medicos.jsx";
import { Pacientes } from "./Pacientes.jsx";
import { Turnos } from "./Turnos.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="registro" element={<Registro />} />

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
