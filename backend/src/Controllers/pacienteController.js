import { PacienteService } from "../Services/pacienteService.js";

export class PacienteController{

    constructor(pacienteService) {
        this.pacienteService = pacienteService;
    }

    async getMisTurnos(req, res, next) {
        try {
            const { id } = req.params;

            const turnos = await this.pacienteService.obtenerTurnosSinCompletarPaciente(id);

            res.status(200).json(turnos);
        } catch (error) {
            next(error);
        }
    }

    async getPerfil(req, res, next) {
        try {
            const { id } = req.params;

            const perfil = await this.pacienteService.obtenerPaciente(id);

            res.status(200).json(perfil);
        } catch (error) {
            next(error);
        }
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