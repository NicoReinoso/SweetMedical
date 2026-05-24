import { TurnoRepo } from "../Repositorio/turnoBd.js" 
import { MedicoRepo } from "../Repositorio/medicoBd.js"
import { EstadoTurno, Turno } from "../Models/turno.js"
import { PacienteRepo } from "../Repositorio/pacienteBd.js"
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError
} from "../errors/AppError.js"
import { NotificacionService } from "./notificacionService.js";

export class TurnoService {
    constructor({
        turnoRepo = new TurnoRepo(),
        medicoRepo = new MedicoRepo(),
        notificacionService = new NotificacionService(),
        pacienteRepo = new PacienteRepo()
    } = {}) {
        this.turnoRepo = turnoRepo;
        this.medicoRepo = medicoRepo;
        this.notificacionService = notificacionService;
        this.pacienteRepo = pacienteRepo;
    }


    async obtenerTurno(id) {
        const turno = await this.turnoRepo.findTurno(id);
        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }

        return turno;
    }

    async buscarDisponibles(filtros) {

    const {
        medicoNombre,
        especialidad,
        practica,
        sede,
        fechaDesde,
        fechaHasta
    } = filtros;

    // 1) obtener tpdos los médicos
    let medicos = await this.medicoRepo.findAll();

    // Filtro todos los medicos por los query params recibidos
    if (medicoNombre) {
        medicos = medicos.filter(m => m.nombre === medicoNombre);
    }

    if (especialidad) {
        medicos = medicos.filter(m => m.especialidades.includes(especialidad));
    }

    if (practica) {
        medicos = medicos.filter(m => m.practicas.includes(practica));
    }

    if (sede) {
        medicos = medicos.filter(m => m.sedes.includes(sede));
    }

    const resultados = [];

    // si NO mandan fechas, devolver disponibilidades semanales
    if (!fechaDesde || !fechaHasta) {

        for (const medico of medicos) {

            for (const disponibilidad of medico.disponibilidad) {

                resultados.push({
                    medicoId: medico._id,
                    medico: medico.nombre,
                    especialidades: medico.especialidades,
                    practicas: medico.practicas,
                    sedes: medico.sedes,
                    diaSemana: disponibilidad.diaSemana,
                    horaDesde: disponibilidad.horaDesde,
                    horaHasta: disponibilidad.horaHasta
                });
            }
        }

        return resultados;
    }

    // si mandan rango de fechas
    const desde = new Date(fechaDesde);
    const hasta = new Date(fechaHasta);

    for (const medico of medicos) {

        for (
            let fecha = new Date(desde);
            fecha <= hasta;
            fecha.setDate(fecha.getDate() + 1)
        ) {

            const diaSemana = obtenerDiaSemana(fecha);

            const disponibilidadesDia = medico.disponibilidad.filter(
                d => d.diaSemana === diaSemana
            );

            for (const disponibilidad of disponibilidadesDia) {

                const fechaSlot = construirFechaHora(
                    fecha,
                    disponibilidad.horaDesde
                );

                const ocupado = await this.turnoRepo.existeTurno(
                    medico._id,
                    fechaSlot
                );

                if (!ocupado) {

                    resultados.push({
                        medicoId: medico._id,
                        medico: medico.nombre,
                        especialidades: medico.especialidades,
                        practicas: medico.practicas,
                        sedes: medico.sedes,
                        fechaHora: fechaSlot
                    });
                }
            }
        }
    }

    return resultados;
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
        const sede = data.sede;
        medico.validarSedeSolicitada(sede);

        const pacienteSolicitante = await this.pacienteRepo.findById(data.pacienteId);

        //validacion de practica (si se mando)
        if(data.practica){
            const practica = data.practica
            medico.validarPracticaSolicitada(practica)
            const nuevoTurno = new Turno(medico.id, data.pacienteId, fecha, sede, practica, practica.calcularCostoFinal(pacienteSolicitante));
        }
        //validacion de especialidad (si se mando)
        if(data.especialidad){
            const especialidad = data.especialidad
            medico.validarPracticaSolicitada(especialidad)
            const nuevoTurno = new Turno(medico.id, data.pacienteId, fecha, sede, especialidad, especialidad.calcularCostoFinal(pacienteSolicitante));
        }
        

        //actualizo los repo
        const turnoGuardado = await this.turnoRepo.createTurno(nuevoTurno);

        //se agrega el nuevo turno a los solicitados del medico, para que pueda aceptarlo
        await this.medicoRepo.agregarTurnoSolicitado(medico._id, nuevoTurno._id);

        //se notifica al medico
        await this.notificacionService.crear(nuevoTurno.medicoId, nuevoTurno.pacienteId, "Nuevo turno solicitado");

        return turnoGuardado;
    }

    async cancelarTurnoConMotivo(id, motivo) {
    return await this.cancelarTurno(id, motivo);
    }

    async getHistorialPaciente(pacienteId) {
        return await this.turnoRepo.findByPacienteId(pacienteId);
    }



    async cancelarTurno(id, motivo) {
        const turno = await this.turnoRepo.findTurno(id);
        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }

        validaCancelable(turno);
        validaAnticipacion(turno.fechaHora);

        const medico = await this.medicoRepo.findById(turno.medico);
        if (!medico) {
            throw new NotFoundError("Medico no encontrado (por qué existe un turno con el id de un medico inexistente?!?!)");
        }

        // cambiar estado
        turno.estado = EstadoTurno.CANCELADO;
        turno.historialEstados.push(EstadoTurno.CANCELADO);
        turno.motivoCancelacion = motivo;

        await this.turnoRepo.updateTurno(id, turno);

        // se remueve el turno cancelado de la lista de turnos solicitados/aceptados del medico
        medico.removerTurno(id);

        await this.medicoRepo.updateMedico(medico.id, medico);

        await this.notificacionService.crear(turno.pacienteId, turno.medicoId, "Su turno fue cancelado");

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

        //notifico al paciente del cambio
        await this.notificacionService.crear(turno.pacienteId, turno.medicoId, "Su turno fue cambiado");

        return await this.turnoRepo.updateTurno(id, turno);
    }

    async reprogramarTurno(id, nuevaFechaHora) {
        const turno = await this.turnoRepo.findTurno(id);
        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }

        validaCancelable(turno);
        validaAnticipacion(turno.fechaHora);

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

        await this.notificacionService.crear(turno.medicoId, turno.pacienteId, "Un turno fue reprogramado");
        
        return await this.turnoRepo.updateTurno(id, turno);
    }
    
}

//METODOS AUXILIARES
const validaCancelable = (turno) => {
    if (turno.historialEstados.includes(EstadoTurno.REALIZADO)) {
        throw new ConflictError("No se puede operar sobre un turno realizado");
    }
    if (turno.historialEstados.includes(EstadoTurno.CANCELADO)) {
        throw new ConflictError("No se puede operar sobre un turno cancelado");
    }
}

const validaAnticipacion = (fechaHora) => {
    const diferenciaMs = new Date(fechaHora) - new Date();
    if (diferenciaMs < 60 * 60 * 1000) {
        throw new BadRequestError("Se requiere al menos 1 hora de anticipación");
    }
}

const obtenerDiaSemana = (fecha) => {
    const dias = ["DOMINGO","LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO"];
    return dias[fecha.getDay()];
};

const obtenerHora = (fecha) => {
    return fecha.toTimeString().slice(0,5); // "HH:MM"
};

const construirFechaHora = (fecha, hora) => {
    const [h, m] = hora.split(":");

    const nuevaFecha = new Date(fecha);

    nuevaFecha.setHours(h);
    nuevaFecha.setMinutes(m);
    nuevaFecha.setSeconds(0);
    nuevaFecha.setMilliseconds(0);

    return nuevaFecha;
};