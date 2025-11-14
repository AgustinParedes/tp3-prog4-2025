import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT id_medicos, nombre, apellido, especialidad, matricula FROM medicos");
  res.json({ success: true, medicos: rows });
});

router.get("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute("SELECT id_medicos, nombre, apellido, especialidad, matricula FROM medicos WHERE id_medicos=?", [id]);

  if (rows.length === 0)
    return res.status(404).json({
      success: false,
      message: "Médico no encontrado",
    });

  res.json({ success: true, medico: rows[0] });
});

router.post(
  "/",
  verificarAutenticacion,

  body("nombre", "El nombre solo puede contener letras y espacios")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)
    .isLength({ max: 45 }),
  body("apellido", "El apellido solo puede contener letras y espacios")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)
    .isLength({ max: 45 }),
  body("especialidad").isString().isLength({ max: 45 }),
  body("matricula").isString().isLength({ max: 45 }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, apellido, especialidad, matricula } = req.body;
    await db.execute("INSERT INTO medicos (nombre, apellido, especialidad, matricula) VALUES (?,?,?,?)", [nombre, apellido, especialidad, matricula]);
    res.status(201).json({ success: true, message: "Médico creado" });
  }
);

router.put(
  "/:id",
  verificarAutenticacion,
  validarId,

  body("nombre", "El nombre solo puede contener letras y espacios")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)
    .isLength({ max: 45 }),
  body("apellido", "El apellido solo puede contener letras y espacios")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)
    .isLength({ max: 45 }),
  body("especialidad").isString().isLength({ max: 45 }),
  body("matricula").isString().isLength({ max: 45 }),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, apellido, especialidad, matricula } = req.body;

    const [rows] = await db.execute("SELECT * FROM medicos WHERE id_medicos=?", [id]);
    if (rows.length === 0)
      return res.status(404).json({
        success: false,
        message: "Médico no encontrado",
      });

    await db.execute("UPDATE medicos SET nombre=?, apellido=?, especialidad=?, matricula=? WHERE id_medicos=?", [nombre, apellido, especialidad, matricula, id]);

    res.json({ success: true, message: "Médico actualizado" });
  }
);

router.delete("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);

  const [turnos] = await db.execute("SELECT 1 FROM turnos WHERE id_medico = ? LIMIT 1", [id]);
  if (turnos.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Error: No se puede eliminar al médico porque tiene turnos asignados.",
    });
  }

  const [rows] = await db.execute("SELECT * FROM medicos WHERE id_medicos=?", [id]);
  if (rows.length === 0)
    return res.status(404).json({
      success: false,
      message: "Médico no encontrado",
    });

  await db.execute("DELETE FROM medicos WHERE id_medicos=?", [id]);
  res.json({ success: true, message: "Médico eliminado" });
});

export default router;
