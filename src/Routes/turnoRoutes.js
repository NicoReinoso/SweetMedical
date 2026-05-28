import express from "express";
import { TurnoController } from "../Controllers/turnoController.js"
import { validarTurno, validarCancelacion, validarReprogramacion  } from "../middlewares/validarTurno.js";


const turnoController = new TurnoController()
const router = express.Router();

/**
 * @swagger
 * /turnos/disponibles:
 *   get:
 *     summary: Busca turnos disponibles con filtros opcionales
 *     tags:
 *       - Turnos
 *     parameters:
 *       - in: query
 *         name: medicoId
 *         schema:
 *           type: string
 *         description: ID del médico
 *       - in: query
 *         name: especialidad
 *         schema:
 *           type: string
 *         description: Especialidad buscada
 *       - in: query
 *         name: practica
 *         schema:
 *           type: string
 *         description: Práctica buscada
 *       - in: query
 *         name: sede
 *         schema:
 *           type: string
 *         description: Sede de atención
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Inicio del rango de fechas
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fin del rango de fechas
 *     responses:
 *       200:
 *         description: Lista de turnos disponibles
 *       400:
 *         description: Filtros inválidos
 */
router.get("/disponibles", turnoController.buscarDisponibles.bind(turnoController));

/**
 * @swagger
 * /turnos/{id}:
 *   get:
 *     summary: Obtiene un turno por ID
 *     tags:
 *       - Turnos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno
 *     responses:
 *       200:
 *         description: Turno encontrado
 *       404:
 *         description: Turno no encontrado
 */
router.get('/:id', turnoController.getTurno.bind(turnoController));


/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Reserva un nuevo turno
 *     tags:
 *       - Turnos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TurnoInput'
 *     responses:
 *       201:
 *         description: Turno reservado exitosamente
 *       400:
 *         description: Médico sin disponibilidad en ese horario
 *       409:
 *         description: Ya existe un turno en ese horario
 *       422:
 *         description: Campo inexistente o faltante en body
 */
router.post('/', validarTurno, turnoController.reservarTurno.bind(turnoController));

/**
 * @swagger
 * /turnos/{id}/reprogramar:
 *   patch:
 *     summary: Reprograma un turno a un nuevo horario disponible del mismo médico
 *     tags:
 *       - Turnos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fechaHora
 *             properties:
 *               fechaHora:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-20T14:00:00.000Z"
 *     responses:
 *       200:
 *         description: Turno reprogramado
 *       400:
 *         description: Menos de 1 hora de anticipación o médico sin disponibilidad
 *       404:
 *         description: Turno no encontrado
 *       409:
 *         description: Ya existe un turno en el nuevo horario
 *       422:
 *         description: Campo inexistente o faltante en body
 */
router.patch('/:id/reprogramar', validarReprogramacion, turnoController.reprogramarTurno.bind(turnoController));

/**
 * @swagger
 * /turnos/{id}:
 *   delete:
 *     summary: Cancela un turno con motivo
 *     tags:
 *       - Turnos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - motivo
 *             properties:
 *               motivo:
 *                 type: string
 *                 example: "No puedo asistir por viaje"
 *     responses:
 *       200:
 *         description: Turno cancelado
 *       400:
 *         description: Menos de 1 hora de anticipación
 *       404:
 *         description: Turno no encontrado
 *       409:
 *         description: El turno ya está cancelado o realizado
 *       422:
 *         description: Campo inexistente o faltante en body
 */
router.delete('/:id', validarCancelacion, turnoController.cancelarTurno.bind(turnoController));

/**
 * @swagger
 * /turnos/{id}/realizar:
 *   patch:
 *     summary: Marca un turno como realizado
 *     tags:
 *       - Turnos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno
 *     responses:
 *       200:
 *         description: Turno marcado como realizado
 *       404:
 *         description: Turno no encontrado
 *       409:
 *         description: El turno ya está cancelado o realizado
 */
router.patch('/:id/realizar', turnoController.realizarTurno.bind(turnoController));

/**
 * @swagger
 * /turnos/{id}/modificacion-medico:
 *   patch:
 *     summary: Permite al médico modificar los datos de un turno
 *     tags:
 *       - Turnos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fechaHora:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-20T14:00:00.000Z"
 *               sede:
 *                 type: string
 *                 example: "Medrano"
 *               practica:
 *                 type: string
 *                 example: "Cardiología"
 *     responses:
 *       200:
 *         description: Turno modificado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Turno no encontrado
 *       409:
 *         description: El turno ya fue finalizado
 */

router.patch('/:id/modificacion-medico', turnoController.modificarTurno.bind(turnoController));

export default router
