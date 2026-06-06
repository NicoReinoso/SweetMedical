import express from "express";
import { turnoController } from "../container.js";
import { validarTurno, validarCancelacion, validarReprogramacion  } from "../middlewares/validarTurno.js";


const router = express.Router();

/**
 * @swagger
 * /turnos/disponibles:
 *   get:
 *     summary: Buscar turnos disponibles
 *     description: |
 *       Genera y devuelve todos los turnos disponibles que podrían solicitarse
 *       según los filtros enviados. Cada resultado representa un posible turno
 *       para una práctica o especialidad determinada en un horario libre de un médico.
 *
 *       No se permite filtrar simultáneamente por práctica y especialidad.
 *
 *     tags:
 *       - Turnos
 *
 *     parameters:
 *       - in: query
 *         name: pacienteId
 *         required: false
 *         schema:
 *           type: string
 *         description: ID del paciente para calcular cobertura y costo estimado.
 *
 *       - in: query
 *         name: medicoNombre
 *         required: false
 *         schema:
 *           type: string
 *         description: Nombre exacto del médico.
 *
 *       - in: query
 *         name: especialidad
 *         required: false
 *         schema:
 *           type: string
 *         description: Especialidad buscada.
 *
 *       - in: query
 *         name: practica
 *         required: false
 *         schema:
 *           type: string
 *         description: Práctica buscada.
 *
 *       - in: query
 *         name: sede
 *         required: false
 *         schema:
 *           type: string
 *         description: Sede donde se desea atender.
 *
 *       - in: query
 *         name: fechaDesde
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha inicial del rango de búsqueda.
 *
 *       - in: query
 *         name: fechaHasta
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha final del rango de búsqueda.
 *
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - fechaHora
 *             - costoEstimado
 *           default: fechaHora
 *         description: Campo utilizado para ordenar los resultados.
 *
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: asc
 *         description: Sentido del ordenamiento.
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página.
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Cantidad de resultados por página.
 *
 *     responses:
 *       200:
 *         description: Turnos disponibles obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 42
 *
 *                 page:
 *                   type: integer
 *                   example: 1
 *
 *                 limit:
 *                   type: integer
 *                   example: 10
 *
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *
 *                 resultados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TurnoDisponible'
 *
 *       400:
 *         description: Filtros inválidos.
 *
 *       404:
 *         description: Paciente no encontrado.
 *
 *       500:
 *         description: Error interno del servidor.
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
 * /turnos/{id}/fecha:
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
router.patch('/:id/fecha', validarReprogramacion, turnoController.reprogramarTurno.bind(turnoController));

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
 * /turnos/{id}/estado:
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
router.patch('/:id/estado', turnoController.realizarTurno.bind(turnoController));

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
