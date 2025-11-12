import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import usuariosRouter from "./usuarios.js";
import medicosRouter from "./medicos.js";
import pacientesRouter from "./pacientes.js";
import turnosRouter from "./turnos.js";
import authRouter, { authConfig } from "./auth.js";

conectarDB();

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());
// Habilito CORS
app.use(cors());
authConfig();

app.get("/", (req, res) => {
  res.send("Gestión de pacientes, médicos y turnos funcionando en puerto " + port);
});

app.use("/usuarios", usuariosRouter);
app.use("/medicos", medicosRouter);
app.use("/pacientes", pacientesRouter);
app.use("/turnos", turnosRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en el puerto ${port}`);
});
