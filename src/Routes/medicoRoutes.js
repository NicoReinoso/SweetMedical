const express = require('express');
const router = express.Router();
const medicoController = require('../Controllers/medicoController');

// Ruta: GET /medicos/:id/disponibilidad
router.get('/:id/disponibilidad', medicoController.getDisponibilidad);

module.exports = router;