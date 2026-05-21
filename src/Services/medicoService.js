import { MedicoRepo } from "../Repositorio/medicoBd.js" 
import { Medico } from "../Models/medico.js"
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError
} from "../errors/AppError.js"


export class MedicoService{

    constructor({ medicoRepo = new MedicoRepo() } = {}) {
        this.medicoRepo = medicoRepo;
    }

    toDTO(medico) {
        return {
            id: medico.id || medico._id,
            usuario: medico.usuario,
            matricula: medico.matricula,
            nombre: medico.nombre,
            especialidades: medico.especialidades,
            practicas: medico.practicas,
            sedes: medico.sedes,
            disponibilidad: medico.disponibilidad,
            turnosSolicitados: medico.turnosSolicitados,
            turnosAceptados: medico.turnosAceptados
        }
    }

    async obtenerDisponibilidad(medicoId) {
        const medico = await this.medicoRepo.findById(medicoId);

        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }

        return medico.disponibilidad;
    };

    async agregarDisponibilidad(medicoId, disponibilidad) {
        const medico = await this.medicoRepo.findById(medicoId);
        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }

        medico.agregarDisponibilidad(disponibilidad);

        await this.medicoRepo.updateDisponibilidad(medicoId, medico.disponibilidad);
        return disponibilidad;
    };


    async bajaDisponibilidad(id, horarioABorrar) {

        const medico = await this.medicoRepo.findById(id);
        if (!medico) {
            throw new NotFoundError("Medico no encontrado");
        }

        const disponibilidad = medico.disponibilidad.find(h =>
            h.diaSemana === horarioABorrar.diaSemana &&
            h.horaDesde === horarioABorrar.horaDesde &&
            h.horaHasta === horarioABorrar.horaHasta
        );

        if (!disponibilidad) {
            throw new ConflictError("Disponibilidad no encontrada");
        }

        if (disponibilidad.ocupado) {
            throw new ConflictError("No se puede eliminar una disponibilidad ocupada");
        }

        const disponibilidadActualizada = medico.disponibilidad.filter(h =>
            h !== disponibilidad
        );

        await this.medicoRepo.updateDisponibilidad(id, disponibilidadActualizada);
        return disponibilidadActualizada;
    };
}
