import { TurnoService } from "../Services/turnoService.js";

export class TurnoController {
    constructor({turnoService = new TurnoService()} = {}) {
        this.turnoService = turnoService;
    }

    getTurno = (req, res) => {
        try {
            const { id } = req.params;

            const turno = this.turnoService.findById(id);
            res.status(200).json(turno);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    };

    reservarTurno = (req, res) => {
        try {
            const { id } = req.params;
            const { pacienteId } = req.body;

            const turno = this.turnoService.reservarTurno(id, pacienteId);
            res.status(201).json(turno);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    cancelarTurno = (req, res) => {
        try {
            const { id } = req.params;

            const turno = this.turnoService.cancelarTurno(id);
            res.status(200).json(turno);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
}