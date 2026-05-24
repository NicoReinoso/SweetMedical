import express from "express";
import { TurnoController } from "../Controllers/turnoController.js"
import { validarTurno, validarCancelacion, validarReprogramacion  } from "../middlewares/validarTurno.js";


const turnoController = new TurnoController()
const router = express.Router();

// Ruta: GET /turnos/:id
router.get('/:id', turnoController.getTurno.bind(turnoController));

// Ruta: GET /turnos/disponibles?filtros
router.get("/turnos/disponibles", turnoController.buscarDisponibles.bind(turnoController));

// Ruta: POST /turnos
router.post('/', validarTurno, turnoController.reservarTurno.bind(turnoController));

// Ruta: PATCH /turnos/:id/reprogramar
router.patch('/:id/reprogramar', validarReprogramacion, turnoController.reprogramarTurno.bind(turnoController));

// Ruta: DELETE /turnos/:turnoId
router.delete('/:id', validarCancelacion, turnoController.cancelarTurno.bind(turnoController));

// Ruta: PATCH /turnos/:id/realizar
router.patch('/:id/realizar', turnoController.realizarTurno.bind(turnoController));

// Ruta: PATCH /turnos/:id/modificacion-medico
router.patch('/:id/modificacion-medico', turnoController.modificarTurno.bind(turnoController));



export default router
