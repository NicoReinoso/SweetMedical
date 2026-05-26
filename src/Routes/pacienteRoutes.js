import express from "express";
import { PacienteController } from "../Controllers/pacienteController.js";

const pacienteController = new PacienteController()
const router = express.Router();

/**
 * @swagger
 * /pacientes/{id}/historial:
 *   get:
 *     summary: Obtiene el historial de turnos de un paciente
 *     tags:
 *       - Pacientes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Lista de turnos del paciente ordenados por fecha descendente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turno'
 *       404:
 *         description: Paciente no encontrado
 */

// Ruta GET /pacientes/:id/historial
router.get('/:id/historial', pacienteController.getHistorial.bind(pacienteController));

export default router;