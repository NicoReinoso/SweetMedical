import express from "express";
import { PacienteController } from "../Controllers/pacienteController.js";

const pacienteController = new PacienteController()
const router = express.Router();

// Ruta GET /pacientes/:id/historial
router.get('/:id/historial', pacienteController.getHistorial.bind(pacienteController));

export default router;