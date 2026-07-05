import { PacienteService } from "../Services/pacienteService.js";

export class PacienteController{

    constructor(pacienteService) {
        this.pacienteService = pacienteService;
    }

    async getHistorial(req, res, next) {
        try {
            const { id } = req.params;

            const historial = await this.pacienteService.obtenerHistorial(id);

            res.status(200).json(historial);
        } catch (error) {
            next(error);
        }
    }
}