import { PacienteRepo } from "../Repositorio/pacienteBd.js"
import { TurnoRepo } from "../Repositorio/turnoBd.js";
import { Paciente } from "../Models/paciente.js"
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError
} from "../errors/AppError.js"

export class PacienteService{
    constructor({
        pacienteRepo = new PacienteRepo(),
        turnoRepo = new TurnoRepo()
    } = {}) {

        this.pacienteRepo = pacienteRepo;
        this.turnoRepo = turnoRepo;
    }

    async obtenerHistorial(idPaciente) {

        const paciente = await this.pacienteRepo.findById(idPaciente);

        if (!paciente) {
            throw new NotFoundError("Paciente no encontrado");
        }

        return await this.turnoRepo.findByPaciente(idPaciente);
    }
}