import express from "express";
import { TurnoController } from "../Controllers/turnoController.js"
import { validarTurno, validarCancelacion, validarReprogramacion, validarFiltrosTurno } from "../middlewares/validarTurno.js";

const turnoController = new TurnoController();
const router = express.Router();

/**
 * @swagger
 * /turnos/disponibles:
 *   get:
 *     summary: Busca turnos disponibles con cálculo de cobertura para el paciente
 *     tags:
 *       - Turnos
 *     parameters:
 *       - in: query
 *         name: pacienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del paciente (necesario para calcular cobertura)
 *       - in: query
 *         name: fechaDesde
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Inicio del rango de fechas (ej. 2026-06-01T00:00:00.000Z)
 *       - in: query
 *         name: fechaHasta
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fin del rango de fechas (ej. 2026-06-30T23:59:59.000Z)
 *       - in: query
 *         name: medicoNombre
 *         schema:
 *           type: string
 *         description: Nombre del médico (búsqueda parcial)
 *       - in: query
 *         name: especialidad
 *         schema:
 *           type: string
 *         description: Nombre de la especialidad
 *       - in: query
 *         name: practica
 *         schema:
 *           type: string
 *         description: Nombre de la práctica
 *       - in: query
 *         name: sede
 *         schema:
 *           type: string
 *         description: Sede de atención
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Resultados por página (máximo 100)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [fechaHora, costoEstimado]
 *           default: fechaHora
 *         description: Campo de ordenamiento
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Dirección del ordenamiento
 *     responses:
 *       200:
 *         description: Lista paginada de turnos disponibles con información de cobertura
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 resultados:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       medicoId:
 *                         type: string
 *                       medico:
 *                         type: string
 *                       especialidad:
 *                         type: string
 *                       practica:
 *                         type: string
 *                       fechaHora:
 *                         type: string
 *                         format: date-time
 *                       sede:
 *                         type: string
 *                       costoBase:
 *                         type: number
 *                       costoEstimado:
 *                         type: number
 *                       estadoCobertura:
 *                         type: string
 *                         enum: [TOTAL, PARCIAL, NO_CUBIERTA]
 *                       porcentajeCobertura:
 *                         type: number
 *       400:
 *         description: Fechas inválidas o rango incorrecto
 *       404:
 *         description: Paciente no encontrado
 *       422:
 *         description: Parámetros de búsqueda inválidos
 */
router.get("/disponibles", validarFiltrosTurno, turnoController.buscarDisponibles.bind(turnoController));

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

export default router;
