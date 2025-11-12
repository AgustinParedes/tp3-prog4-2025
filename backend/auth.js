import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Creo estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      next(null, payload);
    })
  );
}

export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

router.post("/login", body("email", "Correo electrónico incorrecto.").isEmail().isLength({ max: 100 }), body("contraseña").notEmpty(), verificarValidaciones, async (req, res) => {
  const { email, contraseña } = req.body;

  // Consultar por el email a la base de datos
  const [usuarios] = await db.execute("SELECT * FROM usuarios WHERE email=?", [email]);

  if (usuarios.length === 0) {
    return res.status(400).json({ success: false, error: "Email inválido" });
  }

  // Verificar la contraseña
  const hashedPassword = usuarios[0].contraseña;

  const contraseñaComparada = await bcrypt.compare(contraseña, hashedPassword);

  if (!contraseñaComparada) {
    return res.status(400).json({ success: false, error: "Contraseña incorrecta." });
  }

  // Generar jwt
  const payload = { userId: usuarios[0].id_usuario };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "4h",
  });

  // Devolver jwt y otros datos
  res.json({
    success: true,
    token,
    username: usuarios[0].email,
  });
});

export default router;
