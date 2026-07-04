import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/AppError.js";

export class LoginService {
    constructor(pacienteService, medicoService) {
        this.pacienteService = pacienteService;
        this.medicoService = medicoService;
    }

    async login(usuario, password) {

        // Intentar login como paciente
        const tokenPaciente = await this.intentarLoginPaciente(usuario, password);

        if (tokenPaciente) {
            return tokenPaciente;
        }

        // Intentar login como médico
        const tokenMedico = await this.intentarLoginMedico(usuario, password);

        if (tokenMedico) {
            return tokenMedico;
        }

        throw new UnauthorizedError("Usuario o contraseña incorrectos");
    }

    async intentarLoginPaciente(usuario, password) {

        const paciente = await this.pacienteService.obtenerPorUsuario(usuario);

        if (!paciente) {
            return null;
        }

        if (paciente.password !== password) {
            throw new UnauthorizedError("Usuario o contraseña incorrecta"); // para protejer informacion
        }

        return jwt.sign(
            {
                id: paciente._id,
                rol: "paciente",
                nombre: paciente.nombre
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );
    }

    async intentarLoginMedico(usuario, password) {

        const medico = await this.medicoService.obtenerPorUsuario(usuario);

        if (!medico) {
            return null;
        }

        if (medico.password !== password) {
            throw new UnauthorizedError("Usuario o contraseña incorrecta"); // Para protejer informacion
        }

        return jwt.sign(
            {
                id: medico._id,
                rol: "medico",
                nombre: medico.nombre
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );
    }
}
