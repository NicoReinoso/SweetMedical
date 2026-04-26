import express from "express";
import {MedicoController} from "../Controllers/medicoController.js";
import { validarDisponibilidad } from "../middlewares/validarDisponibilidad.js";

const medicoController = new MedicoController()
const router = express.Router();

// Ruta: GET /medicos/:id/disponibilidad
router.get('/:id/disponibilidad', medicoController.getDisponibilidad);
// Ruta: POST /medicos/:id/disponibilidad
router.post('/:id/disponibilidad', validarDisponibilidad, medicoController.addDisponibilidad);
// Ruta: DELETE /medicos/:id/disponibilidad
router.delete('/:id/disponibilidad', validarDisponibilidad, medicoController.deleteDisponibilidad);



export default router