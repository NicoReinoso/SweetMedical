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

    async agregarEspecialidad(medicoId, especialidadNueva) {
        const medico = await this.medicoRepo.findById(medicoId);
        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }
        
        medico.agregarEspecialidad(especialidadNueva);
        
        await this.medicoRepo.updateEspecialidades(medicoId, medico.especialidades);
   
        return especialidadNueva;
    };

    async modificarEspecialidad(medicoId, especialidadModificada){

        const medico = await this.medicoRepo.findById(medicoId);

        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }

        const especialidadAModificar = medico.especialidades.find(e =>
            (especialidadModificada._id && e._id?.toString() === especialidadModificada._id?.toString()) ||
            (!especialidadModificada._id && e.nombre === especialidadModificada.nombre)
        );

        if (!especialidadAModificar) {
            throw new NotFoundError("Especialidad no encontrada");
        }

        if (especialidadModificada.duracionTurnoEnMins !== undefined) {
            especialidadAModificar.duracionTurnoEnMins = especialidadModificada.duracionTurnoEnMins;
        }
        if (especialidadModificada.costoConsulta !== undefined) {
            especialidadAModificar.costoConsulta = especialidadModificada.costoConsulta;
            especialidadAModificar.costoBase = especialidadModificada.costoConsulta;
        }

        await this.medicoRepo.updateEspecialidades(medicoId, medico.especialidades);

        return especialidadModificada;
}

    async bajaEspecialidad(medicoId, identificador){
        const medico = await this.medicoRepo.findById(medicoId);
        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }

        const especialidadesFiltradas = medico.especialidades.filter(e =>
            e._id?.toString() !== identificador && e.nombre !== identificador
        );

        await this.medicoRepo.updateEspecialidades(medicoId, especialidadesFiltradas);

        return especialidadesFiltradas;
    }

    async agregarPractica(medicoId, practicaNueva) {
        const medico = await this.medicoRepo.findById(medicoId);
        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }

        medico.agregarPractica(practicaNueva);

        await this.medicoRepo.updatePracticas(medicoId, medico.practicas);
        return practicaNueva;
    };

    async modificarPractica(medicoId, practicaModificada){
        const medico = await this.medicoRepo.findById(medicoId);
        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }

        const practicaAModificar = medico.practicas.find(p =>
            (practicaModificada._id && p._id?.toString() === practicaModificada._id?.toString()) ||
            (!practicaModificada._id && p.nombre === practicaModificada.nombre)
        );

        if (!practicaAModificar) {
            throw new NotFoundError("Práctica no encontrada");
        }

        if (practicaModificada.duracionTurnoEnMins !== undefined) {
            practicaAModificar.duracionTurnoEnMins = practicaModificada.duracionTurnoEnMins;
        }
        if (practicaModificada.costo !== undefined) {
            practicaAModificar.costo = practicaModificada.costo;
            practicaAModificar.costoBase = practicaModificada.costo;
        }

        await this.medicoRepo.updatePracticas(medicoId, medico.practicas);
        return practicaModificada;
    }

    async bajaPractica(medicoId, identificador){
        const medico = await this.medicoRepo.findById(medicoId);
        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }

        const practicasFiltradas = medico.practicas.filter(p =>
            p._id?.toString() !== identificador && p.nombre !== identificador
        );

        await this.medicoRepo.updatePracticas(medicoId, practicasFiltradas);

        return practicasFiltradas;
    }
}
