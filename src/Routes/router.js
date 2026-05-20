import express from "express"
import medicoRoutes from "./medicoRoutes.js"
import turnoRoutes from "./turnoRoutes.js"
import pacienteRoutes from "./pacienteRoutes.js"

const router = express.Router()

//Healthcheck
router.get('/health', (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Sweet Medical API operando correctamente"
    });
});

// Configuración de paths bases para cada recurso
router.use('/medicos', medicoRoutes);
router.use('/turnos', turnoRoutes);
router.use('/pacientes', pacienteRoutes);

export default router