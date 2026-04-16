import express from "express";
import medicoController from "../Controllers/medicoController.js"

const router = express.Router();

// Ruta: GET /medicos/:id/disponibilidad
router.get('/:id/disponibilidad', medicoController.getDisponibilidad);

export default router