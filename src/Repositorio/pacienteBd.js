import { PacienteModel } from "../schemas/pacienteSchema.js";

export class PacienteRepo {

    constructor() {
        this.model = PacienteModel;
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async updatePaciente(id, paciente) {
        return await this.model.findByIdAndUpdate(
            id,
            paciente,
            { new: true }
        );
    }
}