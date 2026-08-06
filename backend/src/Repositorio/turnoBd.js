import mongoose from "mongoose";
import { EstadoTurno } from "../Models/turno.js";
import { TurnoModel } from "../schemas/turnoSchema.js";

export class TurnoRepo {
    constructor() {
        this.model = TurnoModel;
    }

    async findTurno(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await this.model.findById(id);
    }

    async findByPacienteSinCompletar(idPaciente) {
        if (!mongoose.Types.ObjectId.isValid(idPaciente)) {
            return null;
        }
        return await this.model.find({
            pacienteId: idPaciente,
            estado: {
                $nin: [
                    EstadoTurno.CANCELADO,
                    EstadoTurno.REALIZADO
                ]
            }
        }).populate("medicoId")
    }

    async findByMedicoSinCompletar(idMedico) {
        if (!mongoose.Types.ObjectId.isValid(idMedico)) {
            return null;
        }
        return await this.model.find({
            medicoId: idMedico,
            estado: {
                $nin: [
                    EstadoTurno.CANCELADO,
                    EstadoTurno.REALIZADO
                ]
            }
        }).populate("pacienteId").populate("medicoId")
    }

    async createTurno(turno) {
        const nuevoTurno = new this.model(turno);
        return await nuevoTurno.save();
    }

    async updateTurno(id, turnoModificado) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await this.model.findByIdAndUpdate(id, turnoModificado, { new: true } );
    }

    async deleteTurno(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await this.model.findByIdAndDelete(id);   
    }

    async existeTurno(medicoId, fechaHora) {
        if (!mongoose.Types.ObjectId.isValid(medicoId)) {
            return null;
        }
        return await this.model.findOne({
            medicoId: medicoId,
            fechaHora: fechaHora,
            estado: {
                $ne: EstadoTurno.CANCELADO
            }
    });
    }

    async findByPaciente(idPaciente) {
        if (!mongoose.Types.ObjectId.isValid(idPaciente)) {
            return null;
        }
        return await this.model.find({
            pacienteId: idPaciente,
            estado: {
                $in: [
                    EstadoTurno.CANCELADO,
                    EstadoTurno.REALIZADO
                ]
            }
        }).populate("medicoId")
    }

    async findByMedico(medicoId) {
        if (!mongoose.Types.ObjectId.isValid(medicoId)) {
            return null;
        }
        return await this.model.find({
            medicoId: medicoId,
            estado: {
                $in: [
                    EstadoTurno.CANCELADO,
                    EstadoTurno.REALIZADO
                ]
            }
        }).populate("pacienteId").populate("medicoId")
    }


    // Devuelve todos los turnos de un paciente, del más reciente al más antiguo
    async findByPacienteId(pacienteId) {
        if (!mongoose.Types.ObjectId.isValid(pacienteId)) {
            return null;
        }
        return await this.model.find({ pacienteId }).sort({ fechaHora: -1 });
    }

    // Busca turnos de un médico en una ventana de 2hs alrededor de una fecha
    async findByMedicoIdEnRango(medicoId, fechaHora) {
        if (!mongoose.Types.ObjectId.isValid(medicoId)) {
            return null;
        }
        const desde = new Date(new Date(fechaHora).getTime() - 2 * 60 * 60 * 1000);
        const hasta = new Date(new Date(fechaHora).getTime() + 2 * 60 * 60 * 1000);
        return await this.model.find({
            medicoId,
            fechaHora: { $gte: desde, $lte: hasta },
            estado: { $ne: EstadoTurno.CANCELADO }
        });
    }
}   
