import { TurnoService } from "../Services/turnoService.js";

export class TurnoController {
    constructor({turnoService = new TurnoService()} = {}) {
        this.turnoService = turnoService;
    }

    async getTurno(req, res, next) {
        try {
            const { id } = req.params;

            const turno = await this.turnoService.obtenerTurno(id);
            res.status(200).json(turno);
        } catch (error) {
            return next(error);
        }
    };

    async reservarTurno(req, res, next) {
        try {
            const { pacienteId, medicoId, fechaHora, sede, practica, costo } = req.body;

            const turno = await this.turnoService.crearTurno({pacienteId, medicoId, fechaHora, sede, practica, costo});
            res.status(201).json(turno);
        } catch (error) {
            return next(error);
        }
    };

    async cancelarTurno(req, res, next) {
        try {
            const { id } = req.params;

            const turno = await this.turnoService.cancelarTurno(id);
            res.status(200).json(turno);
        } catch (error) {
            return next(error);
        }
    };
}