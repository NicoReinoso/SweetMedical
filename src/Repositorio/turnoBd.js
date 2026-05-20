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
        medico: medicoId,
        fechaHora: fechaHora,
        estado: {
            $ne: EstadoTurno.CANCELADO
        }
    });
    }

    async findByPaciente(pacienteId) {
        return await this.model.find({ pacienteId });
    }
}   
