import { TurnoRepo } from "../Repositorio/turnoBd.js" 
import { MedicoRepo } from "../Repositorio/medicoBd.js"
import { EstadoTurno, Turno } from "../Models/turno.js"
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError
} from "../errors/AppError.js"

export class TurnoService {
    constructor(turnoRepo, medicoRepo) {
        this.turnoRepo = turnoRepo;
        this.medicoRepo = medicoRepo;
    }


    async obtenerTurno(id) {
        const turno = await this.turnoRepo.findTurno(id);
        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }

        return turno;
    }
    
    
    async crearTurno(data) {
        const medico = await this.medicoRepo.findById(data.medicoId);

        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
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
            throw new BadRequestError("El medico solicitado no tiene disponibilidad para ese horario");
        }

        //Valido que no haya un turno para ese dia en especifico
        const yaExisteTurno = await this.turnoRepo.existeTurno(medico._id, fecha);
        if (yaExisteTurno) {
            throw new ConflictError("Ya existe un turno para ese horario");
        }

        //validacion de sede
        const sede = data.sede
        medico.validarSedeSolicitada(sede)

        //validacion de practica
        const practica = data.practica
        medico.validarPracticaSolicitada(practica)

        const nuevoTurno = new Turno(medico.id, data.pacienteId, fecha, sede, practica, data.costo);

        //actualizo los repo
        const turnoGuardado = await this.turnoRepo.createTurno(nuevoTurno);

        //se agrega el nuevo turno a los solicitados del medico, para que pueda aceptarlo
        await this.medicoRepo.agregarTurnoSolicitado(medico._id, nuevoTurno._id);
        return turnoGuardado;
    }

    async cancelarTurno(id, motivo) {
        const turno = await this.turnoRepo.findTurno(id);

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

        const medico = await this.medicoRepo.findById(turno.medico);
        if (!medico) {
            throw new NotFoundError("Medico no encontrado (por qué existe un turno con el id de un medico inexistente?!?!)");
        }

        // cambiar estado
        turno.estado = EstadoTurno.CANCELADO;
        turno.historialEstados.push(EstadoTurno.CANCELADO);
        turno.motivoCancelacion = motivo;

        // actualizo los datos en el repo
        await this.turnoRepo.updateTurno(id, turno);

        // se remueve el turno cancelado de la lista de turnos solicitados/aceptados del medico
        medico.removerTurno(id);

        await this.medicoRepo.updateMedico(medico.id, medico);

        return turno;
    }

    async realizarTurno(id) {
        const turno = await this.turnoRepo.findTurno(id);

        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }
        if (turno.historialEstados.includes(EstadoTurno.REALIZADO)){
            throw new ConflictError("No se puede realizar un turno realizado");
        }
        if (turno.historialEstados.includes(EstadoTurno.CANCELADO)){
            throw new ConflictError("No se puede realizar un turno cancelado");
        }

        const medico = await this.medicoRepo.findById(turno.medico);
        if (!medico) {
            throw new NotFoundError("Medico no encontrado (por qué existe un turno con el id de un medico inexistente?!?!)");
        }

        // cambiar estado
        turno.estado = EstadoTurno.REALIZADO;
        turno.historialEstados.push(EstadoTurno.REALIZADO);

        // actualizo los datos en el repo
        await this.turnoRepo.updateTurno(id, turno);

        // se remueve el turno finalizado de la lista de turnos solicitados/aceptados del medico
        medico.removerTurno(id);

        await this.medicoRepo.updateMedico(medico.id, medico);

        return turno;
    }

    async modificarTurnoPorMedico(id, cambios) {
        const turno = await this.turnoRepo.findTurno(id);

        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }
        if (turno.EstadoTurno === EstadoTurno.CONFIRMADO){
            throw new ConflictError("No se puede modificar un turno cancelado");
        }
        if (turno.estado === EstadoTurno.CANCELADO || turno.estado === EstadoTurno.REALIZADO){
            throw new ConflictError("Este turno ya fue finalizado");
        }

        // campos permitidos
        const cambiosPermitidos = {};

        if (cambios.fechaHora) {
            const nuevaFecha = new Date(cambios.fechaHora);

            // fecha inválida
            if (isNaN(nuevaFecha.getTime())) {
                throw new BadRequestError("La fecha es inválida");
            }

            // fecha pasada
            if (nuevaFecha < new Date()) {
                throw new BadRequestError(
                    "La fecha no puede ser anterior a la actual"
                );
            }
            cambiosPermitidos.fechaHora = cambios.fechaHora;
        }

        if (cambios.sede) {
            cambiosPermitidos.sede = cambios.sede;
        }

        if (cambios.practica) {
            cambiosPermitidos.practica = cambios.practica;
        }

        Object.assign(turno, cambiosPermitidos);

        return await this.turnoRepo.updateTurno(id, turno);
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