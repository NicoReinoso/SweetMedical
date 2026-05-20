import express from "express";
import { TurnoController } from "../Controllers/turnoController.js"
import { validarTurno, validarCancelacion, validarReprogramacion  } from "../middlewares/validarTurno.js";


const turnoController = new TurnoController()
const router = express.Router();

// Ruta: GET /turnos/:id
router.get('/:id', turnoController.getTurno);

// Ruta: GET /pacientes/:pacienteId
router.get('/pacientes/:pacienteId', turnoController.getHistorialPaciente);

// Ruta: POST /turnos
router.post('/', validarTurno, turnoController.reservarTurno);

// Ruta: PATCH /turnos/:id/reprogramar
router.patch('/:id/reprogramar', validarReprogramacion, turnoController.reprogramarTurno);

// Ruta: DELETE /turnos/:turnoId
router.delete('/:id', validarCancelacion, turnoController.cancelarTurno);

// Ruta: PATCH /turnos/:id/realizar
router.patch('/:id/realizar', turnoController.realizarTurno);

// Ruta: PATCH /turnos/:id/modificacion-medico
router.patch('/:id/modificacion-medico', turnoController.modificarTurno);



export default router
