import Disponibilidad from "../Models/disponibilidad.js";
import { Medico } from "../Models/medico.js";

//Base de datos
const drHouse = new Medico("med-1", "Dr. House", "matricula1", "House", ["Carpinteria"], ["Cardio"], ["Medrano"]);
drHouse.agregarDisponibilidad(new Disponibilidad ("Lunes", "08:00", "09:00"));
drHouse.agregarDisponibilidad(new Disponibilidad ("Lunes", "09:00", "10:00"));
drHouse.agregarDisponibilidad(new Disponibilidad ("Lunes", "10:00", "11:00"));
drHouse.agregarDisponibilidad(new Disponibilidad ("Lunes", "11:00", "12:00"));
drHouse.agregarDisponibilidad(new Disponibilidad ("Miercoles", "14:00", "15:00"));
drHouse.agregarDisponibilidad(new Disponibilidad ("Miercoles", "15:00", "16:00"));
drHouse.agregarDisponibilidad(new Disponibilidad ("Miercoles", "16:00", "17:00"));

const drOctopus = new Medico("med-2", "Dr. Octavio", "matricula2", "Octavio", ["Cazar Spiderman"], ["Ciencia"], ["New York"]);
drOctopus.agregarDisponibilidad(new Disponibilidad ("Martes", "08:00", "09:00"));
drOctopus.agregarDisponibilidad(new Disponibilidad ("Martes", "09:00", "10:00"));
drOctopus.agregarDisponibilidad(new Disponibilidad ("Martes", "10:00", "11:00"));
drOctopus.agregarDisponibilidad(new Disponibilidad ("Martes", "11:00", "12:00"));
drOctopus.agregarDisponibilidad(new Disponibilidad ("Jueves", "14:00", "15:00"));
drOctopus.agregarDisponibilidad(new Disponibilidad ("Jueves", "15:00", "16:00"));
drOctopus.agregarDisponibilidad(new Disponibilidad ("Jueves", "16:00", "17:00"));

const drMario = new Medico("med-3", "Mariano.04", "matricula3", "Mariano", [], ["Futbol"], ["Campus"]); //no tiene disponibilidad, esta muy ocupado

//Repo
export class MedicoRepo{

    medicosCargados = [drHouse, drMario, drOctopus];

    findById = (id) => this.medicosCargados.find(m => m.id === id);

    updateDisponibilidad = (id, nuevaDisponibilidad) => {
        const index = this.medicosCargados.findIndex(m=> m.id == id);
        
        if(index !=-1){
            this.medicosCargados[index].disponibilidad = nuevaDisponibilidad;
            return this.medicosCargados[index].disponibilidad;
        }
    }
}

