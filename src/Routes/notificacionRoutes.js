import express from "express";
import { NotificacionController } from "../Controllers/notificacionController.js";

const notificacionController = new NotificacionController()
const router = express.Router();

// Ruta: GET /notificaciones/:idUsuario/no-leidas
router.get('/:idUsuario/no-leidas', notificacionController.getNoLeidas);

// Ruta: GET /notificaciones/:idUsuario/leidas
router.get('/:idUsuario/leidas', notificacionController.getLeidas);

// Ruta: PATCH /notificaciones/:id/leer
router.patch('/:id', notificacionController.leer);

export default router
