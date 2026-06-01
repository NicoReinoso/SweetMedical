import express from "express";
import { notificacionController } from "../container.js";

const router = express.Router();

/**
 * @swagger
 * /notificaciones/{destinatarioId}:
 *   get:
 *     summary: Obtener notificaciones de un destinatario
 *     description: |
 *       Retorna las notificaciones de un usuario.
 *       Puede filtrarse por estado utilizando el query parameter `estado`.
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: destinatarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del destinatario de las notificaciones
 *       - in: query
 *         name: estado
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - LEIDA
 *             - NO_LEIDA
 *         description: Filtra las notificaciones por estado
 *     responses:
 *       200:
 *         description: Lista de notificaciones obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notificacion'
 *       404:
 *         description: Destinatario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:destinatarioId', notificacionController.getNotificaciones.bind(notificacionController)); //?estado=LEIDA

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
