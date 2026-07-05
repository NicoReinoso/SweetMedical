import { PacienteModel } from "../schemas/pacienteSchema.js";
import mongoose from "mongoose";

export class PacienteRepo {

    constructor() {
        this.model = PacienteModel;
    }

    async findById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await this.model.findById(id);
    }

    async updatePaciente(id, paciente) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await this.model.findByIdAndUpdate(
            id,
            paciente,
            { new: true }
        );
    }
}