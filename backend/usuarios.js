import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body, param } from "express-validator";
import bcrypt from "bcrypt";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT id_usuario, nombre, email FROM usuarios");
  res.json({ success: true, usuarios: rows });
});

// Obtener usuario por ID
router.get("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute("SELECT id_usuario, nombre, email FROM usuarios WHERE id_usuario=?", [id]);

  if (rows.length === 0) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

  res.json({ success: true, usuario: rows[0] });
});

// Crear un nuevo usuario (REGISTRO)
router.post(
  "/",
  body("nombre")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)
    .isLength({ max: 50 }),
  body("email").isEmail().isLength({ max: 100 }),
  body("contraseña").isStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, contraseña } = req.body;
    const hashed = await bcrypt.hash(contraseña, 12);
    await db.execute("INSERT INTO usuarios (nombre,email,contraseña) VALUES (?,?,?)", [nombre, email, hashed]);
    res.status(201).json({ success: true, message: "Usuario creado" });
  }
);

// Actualizar un usuario existente
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("nombre")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)
    .isLength({ max: 50 }),
  body("email").isEmail().isLength({ max: 100 }),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, email } = req.body;

    const [rows] = await db.execute("SELECT * FROM usuarios WHERE id_usuario=?", [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    await db.execute("UPDATE usuarios SET nombre=?, email=? WHERE id_usuario=?", [nombre, email, id]);
    res.json({ success: true, message: "Usuario actualizado" });
  }
);

// Eliminar un usuario
router.delete("/:id", verificarAutenticacion, validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id);

  const [rows] = await db.execute("SELECT * FROM usuarios WHERE id_usuario=?", [id]);
  if (rows.length === 0) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

  await db.execute("DELETE FROM usuarios WHERE id_usuario=?", [id]);
  res.json({ success: true, message: "Usuario eliminado" });
});

export default router;
