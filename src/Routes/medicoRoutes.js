import express from "express";
import {MedicoController} from "../Controllers/medicoController.js";
import { validarDisponibilidad } from "../middlewares/validarDisponibilidad.js";

const medicoController = new MedicoController()
const router = express.Router();

/**
 * @swagger
 * /medicos/{id}/disponibilidad:
 *   get:
 *     summary: Obtiene las disponibilidades de un médico
 *     tags:
 *       - Médicos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del médico
 *     responses:
 *       200:
 *         description: Lista de disponibilidades
 *       404:
 *         description: Médico no encontrado
 */
router.get('/:id/disponibilidad', medicoController.getDisponibilidad);

/**
 * @swagger
 * /medicos/{id}/disponibilidad:
 *   post:
 *     summary: Agrega una disponibilidad a un médico
 *     tags:
 *       - Médicos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Disponibilidad'
 *     responses:
 *       201:
 *         description: Disponibilidad creada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Médico no encontrado
 */
router.post('/:id/disponibilidad', validarDisponibilidad, medicoController.addDisponibilidad);

/**
 * @swagger
 * /medicos/{id}/disponibilidad:
 *   delete:
 *     summary: Elimina una disponibilidad de un médico
 *     tags:
 *       - Médicos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Disponibilidad'
 *     responses:
 *       200:
 *         description: Disponibilidad eliminada
 *       404:
 *         description: Médico no encontrado
 *       409:
 *         description: Disponibilidad ocupada
 */
router.delete('/:id/disponibilidad', validarDisponibilidad, medicoController.deleteDisponibilidad);

export default router