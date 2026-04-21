import express from "express";
import { TurnoController } from "../Controllers/turnoController.js"

const turnoController = new TurnoController()
const router = express.Router();

// Ruta: GET /turnos/:id
router.get('/:id', turnoController.getTurno);

// Ruta: PUT /turnos/:id/reservar
router.put('/:id/reservar', turnoController.reservarTurno);

// Ruta: PUT /turnos/:id/cancelar
router.put('/:id/cancelar', turnoController.cancelarTurno);

export default router
