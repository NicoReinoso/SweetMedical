import express from "express";
import { medicoController } from "../container.js";
import { validarDisponibilidad } from "../middlewares/validarDisponibilidad.js";
import { validarEspecialidad } from "../middlewares/validarEspecialidad.js";
import { validarPractica } from "../middlewares/validarPractica.js";

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
router.get('/:id/disponibilidad', medicoController.getDisponibilidad.bind(medicoController));

/**
 * @swagger
 * /medicos/sugerencias:
 *   get:
 *     summary: Obtener sugerencias de médicos por nombre
 *     tags:
 *       - Médicos
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Texto parcial del nombre del médico.
 *         example: Dr
 *     responses:
 *       200:
 *         description: Lista de nombres de médicos que coinciden.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             example:
 *               - "Dr. Cristina López"
 *               - "Dr. Cristian García"
 *               - "Dra. Cristina Fernández"
 *       400:
 *         description: Parámetro inválido.
 *       500:
 *         description: Error interno del servidor.
 */
router.get(`/sugerencias`, medicoController.getSugerencias.bind(medicoController));

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
router.post('/:id/disponibilidad', validarDisponibilidad, medicoController.addDisponibilidad.bind(medicoController));

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
router.delete('/:id/disponibilidad', validarDisponibilidad, medicoController.deleteDisponibilidad.bind(medicoController));

/**
 * @swagger
 * /medicos/{id}/especialidad:
 *   post:
 *     summary: Agrega una especialidad a un médico
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
 *             $ref: '#/components/schemas/Especialidad'
 *     responses:
 *       201:
 *         description: Especialidad creada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Médico no encontrado
 *       409:
 *         description: Ya existe una especialidad con el mismo nombre
 *       422:
 *         description: Campo inexistente, de más o faltante en el body
 */
router.post('/:id/especialidad', validarEspecialidad, medicoController.addEspecialidad.bind(medicoController));

/**
 * @swagger
 * /medicos/{id}/especialidad:
 *   patch:
 *     summary: Modifica una especialidad de un médico
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
 *             $ref: '#/components/schemas/Especialidad'
 *     responses:
 *       200:
 *         description: Especialidad modificada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Médico o especialidad no encontrados
 *       422:
 *         description: Campo inexistente o inválido en el body
 */
router.patch('/:id/especialidad/:especialidadId', medicoController.patchEspecialidad.bind(medicoController));

/**
 * @swagger
 * /medicos/{id}/especialidad/{especialidadNombre}:
 *   delete:
 *     summary: Elimina una especialidad de un médico
 *     tags:
 *       - Médicos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: especialidadNombre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Especialidad eliminada
 *       404:
 *         description: Médico o especialidad no encontrados
 */
router.delete('/:id/especialidad/:especialidadId', medicoController.deleteEspecialidad.bind(medicoController));

/**
 * @swagger
 * /medicos/{id}/practica:
 *   post:
 *     summary: Agrega una práctica a un médico
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
 *             $ref: '#/components/schemas/Practica'
 *     responses:
 *       201:
 *         description: Práctica creada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Médico no encontrado
 *       409:
 *         description: Ya existe una práctica con el mismo nombre
 *       422:
 *         description: Campo inexistente, de más o faltante en el body
 */
router.post('/:id/practica', validarPractica, medicoController.addPractica.bind(medicoController));

/**
 * @swagger
 * /medicos/{id}/practica:
 *   patch:
 *     summary: Modifica el costo de una práctica de un médico
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
 *             $ref: '#/components/schemas/Practica'
 *     responses:
 *       200:
 *         description: Práctica modificada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Médico o práctica no encontrados
 *       422:
 *         description: Campo inexistente o inválido en el body
 */
router.patch('/:id/practica/:practicaId', medicoController.patchPractica.bind(medicoController));

/**
 * @swagger
 * /medicos/{id}/practica/{practicaNombre}:
 *   delete:
 *     summary: Elimina una práctica de un médico
 *     tags:
 *       - Médicos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: practicaNombre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Práctica eliminada
 *       404:
 *         description: Médico o práctica no encontrados
 */
router.delete('/:id/practica/:practicaId', medicoController.deletePractica.bind(medicoController));

export default router