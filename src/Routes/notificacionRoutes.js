import express from "express";
import { NotificacionController } from "../Controllers/notificacionController.js";
import { MedicoController } from "../Controllers/medicoController.js";

const notificacionController = new NotificacionController()
const router = express.Router();

/**
 * @swagger
 * /notificaciones/{destinatarioId}/no-leidas:
 *   get:
 *     summary: Obtiene las notificaciones sin leer de un usuario
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: destinatarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de notificaciones sin leer
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:destinatarioId/no-leidas', notificacionController.getNoLeidas.bind(notificacionController));

/**
 * @swagger
 * /notificaciones/{destinatarioId}/leidas:
 *   get:
 *     summary: Obtiene las notificaciones leidas de un usuario
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: destinatarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de notificaciones leidas
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:destinatarioId/leidas', notificacionController.getLeidas.bind(notificacionController));

/**
 * @swagger
 * /notificaciones/{id}:
 *   patch:
 *     summary: Lee una notificacion cambiando estado de atributo "leida"
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificacion leida
 *       404:
 *         description: Notificacion no encontrada
 */
router.patch('/:id', notificacionController.leer.bind(notificacionController));

export default router
