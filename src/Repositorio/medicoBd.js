import Disponibilidad from "../Models/disponibilidad.js";
import mongoose from "mongoose";
import { MedicoModel } from "../schemas/medicoSchema.js";
/*
//Base de datos
const drHouse = new Medico("med-1", "Dr. House", "matricula1", "House", ["Carpinteria"], ["Cardio"], ["Medrano"]);
drHouse.agregarDisponibilidad(new Disponibilidad ("LUNES", "08:00", "09:00"));
drHouse.agregarDisponibilidad(new Disponibilidad ("LUNES", "09:00", "10:00"));
drHouse.agregarDisponibilidad(new Disponibilidad ("LUNES", "10:00", "11:00"));
drHouse.agregarDisponibilidad(new Disponibilidad ("LUNES", "11:00", "12:00"));
drHouse.agregarDisponibilidad(new Disponibilidad ("MIERCOLES", "14:00", "15:00"));
drHouse.agregarDisponibilidad(new Disponibilidad ("MIERCOLES", "15:00", "16:00"));
drHouse.agregarDisponibilidad(new Disponibilidad ("MIERCOLES", "16:00", "17:00"));

const drOctopus = new Medico("med-2", "Dr. Octavio", "matricula2", "Octavio", ["Cazar Spiderman"], ["Ciencia"], ["New York"]);
drOctopus.agregarDisponibilidad(new Disponibilidad ("MARTES", "08:00", "09:00"));
drOctopus.agregarDisponibilidad(new Disponibilidad ("MARTES", "09:00", "10:00"));
drOctopus.agregarDisponibilidad(new Disponibilidad ("MARTES", "10:00", "11:00"));
drOctopus.agregarDisponibilidad(new Disponibilidad ("MARTES", "11:00", "12:00"));
drOctopus.agregarDisponibilidad(new Disponibilidad ("JUEVES", "14:00", "15:00"));
drOctopus.agregarDisponibilidad(new Disponibilidad ("JUEVES", "15:00", "16:00"));
drOctopus.agregarDisponibilidad(new Disponibilidad ("JUEVES", "16:00", "17:00"));

const drMario = new Medico("med-3", "Mariano.04", "matricula3", "Mariano", [], ["Futbol"], ["Campus"]); //no tiene disponibilidad, esta muy ocupado

*/
//Repo
export class MedicoRepo{

    constructor() {
        this.model = MedicoModel;
    }

    // medicosCargados = [drHouse, drMario, drOctopus];

    async findById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
        }
        return await this.model.findById(id);
    }

    async findAll() {
        return await this.model.find({});
    }
    
    async updateMedico(id, medicoModificado) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
        }
        return await this.model.findByIdAndUpdate(id, medicoModificado, { new: true } );
    }


    async updateDisponibilidad(id, nuevaDisponibilidad) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
        }
        return await this.model.findByIdAndUpdate(id, {disponibilidad: nuevaDisponibilidad}, {new: true} );
    }

    async agregarTurnoSolicitado(medicoId, turnoId) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
        }
        return await this.model.findByIdAndUpdate(
        medicoId,
        {
            $push: {
                turnosSolicitados: turnoId
            }
        },
        { new: true }
        );
    }

    async updateEspecialidades(medicoId, especialidadesActualizadas) {
        if (!mongoose.Types.ObjectId.isValid(medicoId)) {
            return null;
        }

        return await this.model.findByIdAndUpdate(
            medicoId,
            { especialidades: especialidadesActualizadas },
            { new: true }
        );
    }   

    async updatePracticas(medicoId, practicasActualizadas) {
        if (!mongoose.Types.ObjectId.isValid(medicoId)) {
        return null;
        }

        return await this.model.findByIdAndUpdate(
            medicoId,
            { practicas: practicasActualizadas },
            { new: true }
        );
    }

    async findEspecialidadById(medicoId, especialidadId) {
        if (!mongoose.Types.ObjectId.isValid(medicoId)) {
            return null;
        }

        const medico = await this.model.findById(medicoId);
        if (!medico) return null;

        return medico.especialidades.find(e => e._id.toString() === especialidadId);
    }

    async findPracticaById(medicoId, practicaId) {
        if (!mongoose.Types.ObjectId.isValid(medicoId)) {
            return null;
        }

        const medico = await this.model.findById(medicoId);
        if (!medico) return null;

        return medico.practicas.find(p => p._id.toString() === practicaId);
    }
}

