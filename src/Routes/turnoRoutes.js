import express from "express";
import { TurnoController } from "../Controllers/turnoController.js"
import { validarTurno } from "../middlewares/validarTurno.js";

const turnoController = new TurnoController()
const router = express.Router();

// Ruta: GET /turnos/:id
router.get('/:id', turnoController.getTurno);

// Ruta: POST /turnos/:pacienteId/reservar
router.post('/:pacienteId/reservar', validarTurno, turnoController.reservarTurno);

// Ruta: PATCH /turnos/:id/cancelar
router.patch('/:id/cancelar', turnoController.cancelarTurno);

export default router
