import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// obtener todos los turnos
router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute(`
        SELECT t.id_turnos, t.fecha, t.hora, t.estado, t.observaciones,
               p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, 
               m.nombre AS medico_nombre, m.apellido AS medico_apellido
        FROM turnos t
        JOIN pacientes p ON t.id_paciente = p.id_pacientes
        JOIN medicos m ON t.id_medico = m.id_medicos
    `);
  res.json({ success: true, turnos: rows });
});

// obtener turno por ID
router.get("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute(
    `SELECT t.id_turnos, t.fecha, t.hora, t.estado, t.observaciones,
            p.nombre AS paciente_nombre, p.apellido AS paciente_apellido, 
            m.nombre AS medico_nombre, m.apellido AS medico_apellido
     FROM turnos t
     JOIN pacientes p ON t.id_paciente = p.id_pacientes
     JOIN medicos m ON t.id_medico = m.id_medicos
     WHERE t.id_turnos = ?`,
    [id]
  );

  if (rows.length === 0) return res.status(404).json({ success: false, message: "Turno no encontrado" });

  res.json({ success: true, turno: rows[0] });
});

// crear nuevo turno
router.post("/", verificarAutenticacion, body("id_paciente").isInt({ min: 1 }), body("id_medico").isInt({ min: 1 }), body("fecha").isISO8601(), body("hora").isTime(), body("observaciones").optional().isString().isLength({ max: 255 }), verificarValidaciones, async (req, res) => {
  const { id_paciente, id_medico, fecha, hora, observaciones } = req.body;
  await db.execute("INSERT INTO turnos (id_paciente, id_medico, fecha, hora, estado, observaciones) VALUES (?,?,?,?, 'pendiente', ?)", [id_paciente, id_medico, fecha, hora, observaciones || null]);

  res.status(201).json({ success: true, message: "Turno creado" });
});

// actualizar turno y observaciones
router.put("/:id", verificarAutenticacion, validarId, body("estado").isIn(["pendiente", "atendido", "cancelado"]), body("observaciones").optional().isString().isLength({ max: 255 }), verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);
  const { estado, observaciones } = req.body;

  const [rows] = await db.execute("SELECT * FROM turnos WHERE id_turnos=?", [id]);
  if (rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Turno no encontrado",
    });
  }

  await db.execute("UPDATE turnos SET estado=?, observaciones=? WHERE id_turnos=?", [estado, observaciones || null, id]);

  res.json({ success: true, message: "Turno actualizado" });
});

// eliminar turno
router.delete("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);

  // Mantenemos el 404
  const [rows] = await db.execute("SELECT * FROM turnos WHERE id_turnos=?", [id]);
  if (rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Turno no encontrado",
    });
  }

  await db.execute("DELETE FROM turnos WHERE id_turnos=?", [id]);
  res.json({ success: true, message: "Turno eliminado" });
});

export default router;
