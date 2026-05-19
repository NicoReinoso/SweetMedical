import { TurnoService } from "../Services/turnoService.js";

export class TurnoController {
    constructor({turnoService = new TurnoService(new TurnoRepo(), new MedicoRepo())} = {}) {
        this.turnoService = turnoService;

        // Binding para que Express no pierda el contexto de "this"
        this.getTurno = this.getTurno.bind(this);
        this.reservarTurno = this.reservarTurno.bind(this);
        this.cancelarTurno = this.cancelarTurno.bind(this);
        this.cancelarTurnoConMotivo = this.cancelarTurnoConMotivo.bind(this);
        this.reprogramarTurno = this.reprogramarTurno.bind(this);
        this.getHistorialPaciente = this.getHistorialPaciente.bind(this);
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


    async cancelarTurnoConMotivo(req, res, next) {
        try {
            const { id } = req.params;
            const { motivo } = req.body;
            const turno = await this.turnoService.cancelarTurnoConMotivo(id, motivo);
            res.status(200).json(turno);
        } catch (error) {
            return next(error);
        }
    }

    async reprogramarTurno(req, res, next) {
        try {
            const { id } = req.params;
            const { fechaHora } = req.body;
            const turno = await this.turnoService.reprogramarTurno(id, fechaHora);
            res.status(200).json(turno);
        } catch (error) {
            return next(error);
        }
    }

    async getHistorialPaciente(req, res, next) {
        try {
            const { pacienteId } = req.params;
            const turnos = await this.turnoService.getHistorialPaciente(pacienteId);
            res.status(200).json(turnos);
        } catch (error) {
            return next(error);
        }
    }
}