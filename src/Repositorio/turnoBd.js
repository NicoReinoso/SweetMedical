import { Turno } from "../Models/turno.js";
import { TurnoModel } from "../schemas/turnoSchema.js";
import { EstadoTurno } from "../Models/turno.js";

export class TurnoRepo {
    constructor() {
        this.model = TurnoModel;
    }

    async findTurno(id) {
        return await this.model.findById(id);
    }

    async createTurno(turno) {
        const nuevoTurno = new this.model(turno);
        return await nuevoTurno.save();
    }

    async updateTurno(id, turnoModificado) {
        return await this.model.findByIdAndUpdate(id, turnoModificado, { new: true } );
    }

    async deleteTurno(id) {
        return await this.model.findByIdAndDelete(id);   
    }

    async existeTurno(medicoId, fechaHora) {
        return await this.model.findOne({
            medicoId,
            fechaHora,
            estado: { $ne: EstadoTurno.CANCELADO }
        });
    }


    // Devuelve todos los turnos de un paciente, del más reciente al más antiguo
    async findByPacienteId(pacienteId) {
        return await this.model.find({ pacienteId }).sort({ fechaHora: -1 });
    }

    // Busca turnos de un médico en una ventana de 2hs alrededor de una fecha
    async findByMedicoIdEnRango(medicoId, fechaHora) {
        const desde = new Date(new Date(fechaHora).getTime() - 2 * 60 * 60 * 1000);
        const hasta = new Date(new Date(fechaHora).getTime() + 2 * 60 * 60 * 1000);
        return await this.model.find({
            medicoId,
            fechaHora: { $gte: desde, $lte: hasta },
            estado: { $ne: EstadoTurno.CANCELADO }
        });
    }
}   
