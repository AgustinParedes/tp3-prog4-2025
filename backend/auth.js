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
  // Opciones de configuracion de passport-jwt
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Creo estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      // Si llegamos a este punto es porque el token es valido
      // Si hace falta realizar algun paso extra antes de llamar al handler de la API
      next(null, payload);
    })
  );
}

export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

// export const verificarAutorizacion = (rol) => {
//   return (req, res, next) => {
//     const roles = req.user.roles;
//     if (!roles.includes(rol)) {
//       return res.status(401).json({ success: false, message: "Usuario no autorizado" });
//     }
//     next();
//   };
// };

router.post(
  "/login",
  body("email", "Correo electrónico incorrecto.").isEmail().isLength({ max: 45 }),
  body("contraseña").isStrongPassword({
    minLength: 8, // Minimo de 8 caracteres
    minLowercase: 1, // Al menos una letra en minusculas
    minUppercase: 0, // Letras mayusculas opcionales
    minNumbers: 1, // Al menos un número
    minSymbols: 0, // Símbolos opcionales
  }),
  verificarValidaciones,
  async (req, res) => {
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

    // Luego de verificar el usuario consultamos por sus roles
    // const [roles] = await db.execute(
    //   "SELECT r.nombre \
    //    FROM roles r \
    //    JOIN usuarios_roles ur ON r.id = ur.rol_id \
    //    WHERE ur.usuario_id=?",
    //   [usuarios[0].id]
    // );

    // const rolesUsuario = roles.map((r) => r.nombre);

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
  }
);

export default router;
