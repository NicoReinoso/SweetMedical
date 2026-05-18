import { Turno } from "../Models/turno.js";

const turno1 = new Turno("1", "med-1", "pac-1", new Date("2026-04-27T08:00:00"), "Sede 1", "Practica 1", 100);
const turno2 = new Turno("2", "med-2", "pac-2", new Date("2026-01-01T11:00:00"), "Sede 2", "Practica 2", 200);
const turno3 = new Turno("3", "med-3", "pac-3", new Date("2026-01-01T12:00:00"), "Sede 3", "Practica 3", 300);

export class TurnoRepo {
    turnosCargados = [turno1, turno2, turno3];

    findTurno = (id) => {
        const turno = this.findById(id);

        return turno;

    }

    generarNuevoId() {
        if (this.turnosCargados.length === 0) return 1;

        const maxId = Math.max(...this.turnosCargados.map(t => Number(t.id)));
        return String(maxId + 1);
    }

    findById = (id) => {
        return this.turnosCargados.find(t => t.id === id);
    }

    createTurno = (turno) => {
        this.turnosCargados.push(turno);
        return turno;
    }

    updateTurno = (id, turno) => {
        const index = this.turnosCargados.findIndex(t => t.id === id);
        if (index !== -1) {
            this.turnosCargados[index] = turno;
            return this.turnosCargados[index];
        }
        return null;
    }

    deleteTurno = (id) => {
        const index = this.turnosCargados.findIndex(t => t.id === id);
        if (index !== -1) {
            this.turnosCargados.splice(index, 1);
            return true;
        }
        return false;
    }
}   
