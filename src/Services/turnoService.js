import { TurnoRepo } from "../Repositorio/turnoBd.js" 
import { MedicoRepo } from "../Repositorio/medicoBd.js"
import { EstadoTurno, Turno } from "../Models/turno.js"
import { Medico } from "../Models/medico.js"
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError
} from "../errors/AppError.js"

export class TurnoService {
    constructor({turnoRepo = new TurnoRepo(), medicoRepo = new MedicoRepo()} = {}) {
        this.turnoRepo = turnoRepo;
        this.medicoRepo = medicoRepo;
    }


    obtenerTurno = (id) =>{
        const turno = this.turnoRepo.findTurno(id);
        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }

        return turno;
    }
    
    
    crearTurno = (data) => {
        const medico = this.medicoRepo.findById(data.medicoId);

        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
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
            throw new BadRequestError("El medico solicitado no tiene disponibilidad para ese horario");
        }
        //validacion de sede
        const sede = data.sede
        medico.validarSedeSolicitada(sede)

        //validacion de practica
        const practica = data.practica
        medico.validarPracticaSolicitada(practica)

        const id = this.turnoRepo.generarNuevoId();
        const nuevoTurno = new Turno(id, medico.id, data.pacienteId, fecha, sede, practica, data.costo);

        //actualizo los repo
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
            throw new NotFoundError("Turno no encontrado");
        }
        if (turno.historialEstados.includes(EstadoTurno.REALIZADO)){
            throw new ConflictError("No se puede cancelar un turno realizado");
        }
        if (turno.historialEstados.includes(EstadoTurno.CANCELADO)){
            throw new ConflictError("No se puede cancelar un turno cancelado");
        }

        const ahora = new Date();
        const fechaTurno = new Date(turno.fechaHora);

        const diferenciaMs = fechaTurno - ahora;
        const unaHoraMs = 60 * 60 * 1000;

        if (diferenciaMs < unaHoraMs) {
            throw new BadRequestError("No se puede cancelar el turno con menos de una hora de anticipación");
        }

        const medico = this.medicoRepo.findById(turno.medicoId);

        // cambiar estado
        turno.estado = EstadoTurno.CANCELADO;
        turno.historialEstados.push(EstadoTurno.CANCELADO);

        // liberar disponibilidad
        const dia = obtenerDiaSemana(fechaTurno);
        const hora = obtenerHora(fechaTurno);

        const disponibilidad = medico.disponibilidad.find(d =>
            d.diaSemana === dia &&
            d.horaDesde === hora
        );

        if (disponibilidad) {
            disponibilidad.ocupado = false;
        }
        // actualizo los datos en el repo
        this.turnoRepo.updateTurno(id, turno);

        // se remueve el turno cancelado de la lista de turnos solicitados del medico
        medico.removerTurnoCancelado(id);

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