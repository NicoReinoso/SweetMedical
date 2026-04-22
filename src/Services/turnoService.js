import { TurnoRepo } from "../Repositorio/turnoBd.js" 
import { MedicoRepo } from "../Repositorio/medicoBd.js"
import { Turno } from "../Models/turno.js"
import { Medico } from "../Models/medico.js"

export class TurnoService {
    constructor({turnoRepo = new TurnoRepo(), medicoRepo = new MedicoRepo()} = {}) {
        this.turnoRepo = turnoRepo;
        this.medicoRepo = medicoRepo;
    }

    findById = (id) => {
        return this.turnoRepo.findById(id);
    }

    crearTurno = (data) => {
        const medico = this.medicoRepo.findById(data.medicoId);

        if (!medico) {
            throw new Error("Médico no encontrado");
        }
        const fecha = new Date(data.fechaHora);
        const dia = obtenerDiaSemana(fecha);
        const hora = obtenerHora(fecha);
        //encuentro la disponibilidad del medico solicitada y la valido
        const disponibilidad = medico.disponibilidad.find(d =>
            d.diaSemana === dia &&
            d.horaDesde === hora &&
            !d.ocupado
        );
        if (!disponibilidad) {
            throw new Error("El medico solicitado no tiene disponibilidad para ese horario");
        }
        //validacion de sede
        const sede = data.sede
        medico.validarSedeSolicitada(sede)

        //validacion de practica
        const practica = data.practica
        medico.validarPracticaSolicitada(practica)

        const id = this.turnoRepo.generarNuevoId();
        const nuevoTurno = new Turno(id, medico.id, data.pacienteId, fecha, sede, practica, data.costo);

        this.turnoRepo.createTurno(nuevoTurno);

        //la disponibilidad del medico se ocupa
        disponibilidad.ocupado = true;
        //se agrega el nuevo turno a los solicitados del medico, para que pueda aceptarlo
        medico.turnosSolicitados.push(nuevoTurno);

        return nuevoTurno;
    }

    cancelarTurno = (id) => {
        const turno = this.turnoRepo.findById(id);
        if (!turno) {
            throw new Error("Turno no encontrado");
        }
        turno.paciente = null;
        turno.estado = EstadoTurno.DISPONIBLE;
        turno.historialEstados.push(EstadoTurno.DISPONIBLE);
        return turno;
    }

}



//METODOS AUXILIARES
const obtenerDiaSemana = (fecha) => {
    const dias = ["DOMINGO","LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO"];
    return dias[fecha.getDay()];
};

const obtenerHora = (fecha) => {
    return fecha.toTimeString().slice(0,5); // "HH:MM"
};