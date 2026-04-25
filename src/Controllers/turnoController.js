import { TurnoService } from "../Services/turnoService.js";

export class TurnoController {
    constructor({turnoService = new TurnoService()} = {}) {
        this.turnoService = turnoService;
    }

    getTurno = (req, res, next) => {
        try {
            const { id } = req.params;

            const turno = this.turnoService.obtenerTurno(id);
            res.status(200).json(turno);
        } catch (error) {
            return next(error);
        }
    };

    reservarTurno = (req, res, next) => {
        try {
            const { pacienteId } = req.params;
            const { medicoId, fechaHora, sede, practica, costo } = req.body;

            const turno = this.turnoService.crearTurno({pacienteId, medicoId, fechaHora, sede, practica, costo});
            res.status(201).json(turno);
        } catch (error) {
            return next(error);
        }
    };

    cancelarTurno = (req, res, next) => {
        try {
            const { id } = req.params;

            const turno = this.turnoService.cancelarTurno(id);
            res.status(200).json(turno);
        } catch (error) {
            return next(error);
        }
    };
}