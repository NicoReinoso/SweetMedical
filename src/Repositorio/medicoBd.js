import Disponibilidad from "../Models/disponibilidad.js";
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
        return await this.model.findById(id)
    }

    
    async updateMedico(id, medicoModificado) {
        return await this.model.findByIdAndUpdate(id, medicoModificado, { new: true } );
    }


    async updateDisponibilidad(id, nuevaDisponibilidad) {
        return await this.model.findByIdAndUpdate(id, {disponibilidad: nuevaDisponibilidad}, {new: true} );
    }

    async agregarTurnoSolicitado(medicoId, turnoId) {
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
}

