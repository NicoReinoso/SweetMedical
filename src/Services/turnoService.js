import { TurnoRepo } from "../Repositorio/turnoBd.js" 
import { MedicoRepo } from "../Repositorio/medicoBd.js"
import { Turno } from "../Models/turno.js"

export class TurnoService {
    constructor({turnoRepo = new TurnoRepo(), medicoRepo = new MedicoRepo} = {}) {
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
            d.horaDesde === hora
        );
        if (!disponibilidad) {
            throw new Error("El medico solicitado no tiene disponibilidad para ese horario");
        }
        //validacion de sede
        const sede = data.sede
        validarSedeSolicitada(sede, medico)

        //validacion de practica
        const practica = data.practica
        validarPracticaSolicitada(practica, medico)

        const id = this.turnoRepo.generarNuevoId();
        const nuevoTurno = new Turno(id, medico, data.paciente, data.fechaHora, sede, practica, data.costo);

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

    //VALIDACIONES
    validarSedeSolicitada = (sede, medico) => {
        if(!medico.sedes.include(sede)){
            throw new Error("El medico solicitado no opera en esa sede");
        }
    }

    validarPracticaSolicitada = (practica, medico) => {
        if(!medico.practicas.include(practica)){
            throw new Error("El medico solicitado no realiza esa practica");
        }
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