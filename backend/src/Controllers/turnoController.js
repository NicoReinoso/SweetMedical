import { TurnoService } from "../Services/turnoService.js";

export class TurnoController {
    constructor(turnoService) {
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

    async buscarDisponibles(req, res, next) {
        try {
            const filtros = req.query;

            const resultados = await this.turnoService.buscarDisponibles(filtros);

            res.status(200).json(resultados);
        } catch (error) {
            next(error);
        }
    }

    async reservarTurno(req, res, next) {
        try {
            const { pacienteId, medicoId, fechaHora, sede, practica, especialidad, costo } = req.body;

            const turno = await this.turnoService.crearTurno({pacienteId, medicoId, fechaHora, sede, practica, especialidad, costo});
            res.status(201).json(turno);
        } catch (error) {
            return next(error);
        }
    };

    async reservarMultiples(req, res, next) {
    try {

        const pacienteId = req.user.id;

        const turnos = await this.turnoService.crearMultiplesTurnos(
            req.body.turnos,
            pacienteId
        );

        res.status(201).json(turnos);

    } catch (error) {
        next(error);
    }
}

    async cancelarTurno(req, res, next) {
        try {
            const { id } = req.params;
            const { motivo } = req.body;

            const turno = await this.turnoService.cancelarTurno(id, motivo);
            res.status(200).json(turno);
        } catch (error) {
            return next(error);
        }
    };

    async realizarTurno(req, res, next) {
        try {
            const { id } = req.params;

            const turno = await this.turnoService.realizarTurno(id);
            res.status(200).json(turno);
        } catch (error) {
            return next(error);
        }
    }

    async modificarTurno(req, res, next) {
        try {
            const { id } = req.params;
            const cambios = req.body;

            const turno = await this.turnoService.modificarTurnoPorMedico(id, cambios);
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
}