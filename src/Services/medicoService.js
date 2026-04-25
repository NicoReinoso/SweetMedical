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

    obtenerDisponibilidad = (medicoId) => {
        const medico = this.medicoRepo.findById(medicoId);
        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
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
        if(!medico){
            throw NotFoundError("Medico no encontrado");        
        }
        
        const disponibilidadActualizada = medico.disponibilidad.filter(h => 
            h.diaSemana !== horarioABorrar.diaSemana ||
            h.horaDesde !== horarioABorrar.horaDesde ||
            h.horaHasta !== horarioABorrar.horaHasta
        ); // comparamos campo a campo, pues al comparar objetos con !== en JS siempre obtenemos true

        if (disponibilidadActualizada.length === medico.disponibilidad.length) {
            throw new ConflictError("Disponibilidad no encontrada, revisar informacion de entrada");
        } // comparamos longitud, pues no sirve directamente hacer disponibilidadActualizada === medico.disponibilidad por cuestiones de JS

        return this.medicoRepo.updateDisponibilidad(id, disponibilidadActualizada);
    }

}
