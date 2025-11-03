import express from "express";

const router = express.Router();

router.get("/", (req, res) => {});
router.get("/:id", (req, res) => {});
router.post("/", (req, res) => {});
router.put("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});

router.get("/:id/usuarios", (req, res) => {});
router.post("/:id/usuarios", (req, res) => {});
router.delete("/:id/usuarios/:usuarioId", (req, res) => {});

export default router;
