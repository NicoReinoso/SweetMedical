import { PacienteRepo } from "../Repositorio/pacienteBd.js"
import { TurnoService } from "./turnoService.js";
import { Paciente } from "../Models/paciente.js"
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError
} from "../errors/AppError.js"

export class PacienteService{
    constructor({
        pacienteRepo,
    } = {}) {

        this.pacienteRepo = pacienteRepo;
    }

    async obtenerPaciente(idPaciente) {
        return await this.pacienteRepo.findById(idPaciente);
    };

    async obtenerPorUsuario(usuario) {
        return await this.pacienteRepo.findByUsuario(usuario);
    };

    async obtenerHistorial(idPaciente) {

        const paciente = await this.pacienteRepo.findById(idPaciente);

        if (!paciente) {
            throw new NotFoundError("Paciente no encontrado");
        }

        return await this.turnoService.encontrarPorPaciente(idPaciente);
    }
}