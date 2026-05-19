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


    //Entrega 2
    async cancelarTurno(id) {
        const turno = await this.turnoRepo.findTurno(id);
        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }

        this.validaCancelable(turno);
        this.validaAnticipacion(turno.fechaHora);

        const medico = await this.medicoRepo.findById(turno.medicoId);

        turno.estado = EstadoTurno.CANCELADO;
        turno.historialEstados.push(EstadoTurno.CANCELADO);

        await this.turnoRepo.updateTurno(id, turno);

        medico.removerTurnoCancelado(id);
        await this.medicoRepo.updateMedico(medico.id, medico);

        return turno;
    }


    async cancelarTurnoConMotivo(id, motivo) {
        const turno = await this.turnoRepo.findTurno(id);
        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }

        this.validaCancelable(turno);
        this.validaAnticipacion(turno.fechaHora);

        const medico = await this.medicoRepo.findById(turno.medicoId);

        turno.estado = EstadoTurno.CANCELADO;
        turno.historialEstados.push(EstadoTurno.CANCELADO);
        turno.motivoCancelacion = motivo;

        await this.turnoRepo.updateTurno(id, turno);

        medico.removerTurnoCancelado(id);
        await this.medicoRepo.updateMedico(medico.id, medico);

        return turno;
    }


    async reprogramarTurno(id, nuevaFechaHora) {
        const turno = await this.turnoRepo.findTurno(id);
        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }

        this.validaCancelable(turno);
        this.validaAnticipacion(turno.fechaHora);

        // Validar disponibilidad del médico en el nuevo horario
        const medico = await this.medicoRepo.findById(turno.medicoId);
        const fecha = new Date(nuevaFechaHora);
        const dia = obtenerDiaSemana(fecha);
        const hora = obtenerHora(fecha);

        const disponibilidad = medico.disponibilidad.find(d =>
            d.diaSemana === dia &&
            d.horaDesde === hora
        );
        if (!disponibilidad) {
            throw new BadRequestError("El médico no tiene disponibilidad para el nuevo horario");
        }

        // Validar que el nuevo slot no esté ocupado
        const yaExisteTurno = await this.turnoRepo.existeTurno(turno.medicoId, fecha);
        if (yaExisteTurno) {
            throw new ConflictError("Ya existe un turno para el nuevo horario solicitado");
        }

        turno.fechaHora = fecha;
        turno.estado = EstadoTurno.REPROGRAMADO;
        turno.historialEstados.push(EstadoTurno.REPROGRAMADO);

        return await this.turnoRepo.updateTurno(id, turno);
    }


    async getHistorialPaciente(pacienteId) {
        return await this.turnoRepo.findByPacienteId(pacienteId);
    }


    //Metodos auxiliares para reutilizar validacion
    validaCancelable(turno) {
        if (turno.historialEstados.includes(EstadoTurno.REALIZADO)) {
            throw new ConflictError("No se puede operar sobre un turno realizado");
        }
        if (turno.historialEstados.includes(EstadoTurno.CANCELADO)) {
            throw new ConflictError("No se puede operar sobre un turno cancelado");
        }
    }

    validaAnticipacion(fechaHora) {
        const diferenciaMs = new Date(fechaHora) - new Date();
        if (diferenciaMs < 60 * 60 * 1000) {
            throw new BadRequestError("Se requiere al menos 1 hora de anticipación");
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