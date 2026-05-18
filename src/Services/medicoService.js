import { MedicoRepo } from "../Repositorio/medicoBd.js" 
import { Medico } from "../Models/medico.js"
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError
} from "../errors/AppError.js"


export class MedicoService{

    constructor({medicoRepo = new MedicoRepo()} = {}) {
        this.medicoRepo = medicoRepo;
    }

    obtenerDisponibilidad = (medicoId, soloDisponibles = false) => {
        const medico = this.medicoRepo.findById(medicoId);

        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }

        if (soloDisponibles) {
            return medico.disponibilidad.filter(d => !d.ocupado);
        }

        return medico.disponibilidad;
    };

    agregarDisponibilidad = (medicoId, disponibilidad) => {
        const medico = this.medicoRepo.findById(medicoId);
        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }

        medico.agregarDisponibilidad(disponibilidad);

        return disponibilidad;
    };


    bajaDisponibilidad = (id, horarioABorrar) => {

        const medico = this.medicoRepo.findById(id);
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

        return this.medicoRepo.updateDisponibilidad(id, disponibilidadActualizada);
    };
}
