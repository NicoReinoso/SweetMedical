import { EstadoTurno, Turno } from "../Models/turno.js";
import { MedicoRepo } from "../Repositorio/medicoBd.js";
import { TurnoRepo } from "../Repositorio/turnoBd.js";
import { PacienteRepo } from "../Repositorio/pacienteBd.js";
import { CoberturaService, TipoPrestacion } from "./coberturaService.js";
import { NotificacionService } from "./notificacionService.js";
import {
    BadRequestError,
    ConflictError,
    NotFoundError
} from "../errors/AppError.js";

export class TurnoService {
    constructor({
        turnoRepo = new TurnoRepo(),
        medicoRepo = new MedicoRepo(),
        pacienteRepo = new PacienteRepo(),
        coberturaService = new CoberturaService(),
        notificacionService = new NotificacionService()
    } = {}) {
        this.turnoRepo = turnoRepo;
        this.medicoRepo = medicoRepo;
        this.pacienteRepo = pacienteRepo;
        this.coberturaService = coberturaService;
        this.notificacionService = notificacionService;
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
            pacienteId,
            medicoNombre,
            especialidad,
            practica,
            sede,
            fechaDesde,
            fechaHasta,
        } = filtros;

        const page  = parseInt(filtros.page)  || 1;
        const limit = parseInt(filtros.limit) || 10;
        const sortBy = filtros.sortBy || 'fechaHora';
        const order  = filtros.order  || 'asc';

        const paciente = await this.pacienteRepo.findById(pacienteId);
        if (!paciente) throw new NotFoundError("Paciente no encontrado");

        const desde = new Date(fechaDesde);
        const hasta = new Date(fechaHasta);
        if (isNaN(desde.getTime()) || isNaN(hasta.getTime())) {
            throw new BadRequestError("Las fechas del rango son inválidas");
        }
        if (desde > hasta) {
            throw new BadRequestError("fechaDesde no puede ser posterior a fechaHasta");
        }

        const medicos = await this.medicoRepo.findByParams({ nombre: medicoNombre, especialidad, practica, sede });

        const resultados = [];

        for (const medico of medicos) {
            // Prestaciones del médico que coinciden con el filtro (o todas si no hay filtro)
            const prestaciones = obtenerPrestacionesConCosto(medico, especialidad, practica);
            if (prestaciones.length === 0) continue;

            // Duración del slot = máxima duración entre las prestaciones relevantes
            const duracionMins = Math.max(...prestaciones.map(p => p.duracionTurnoEnMins));

            for (
                let fecha = new Date(desde);
                fecha <= hasta;
                fecha.setDate(fecha.getDate() + 1)
            ) {
                const diaSemana = obtenerDiaSemana(fecha);
                const disponibilidadesDia = medico.disponibilidad.filter(d => d.diaSemana === diaSemana);

                for (const disp of disponibilidadesDia) {
                    const slots = generarSlots(fecha, disp.horaDesde, disp.horaHasta, duracionMins);

                    for (const fechaSlot of slots) {
                        const ocupado = await this.turnoRepo.existeTurno(medico._id, fechaSlot);
                        if (ocupado) continue;

                        const sedesDisponibles = sede ? [sede] : medico.sedes;

                        for (const sedeMedico of sedesDisponibles) {
                            for (const prestacion of prestaciones) {
                                const infoCobertura = await this.coberturaService.calcularCostoPaciente(
                                    paciente,
                                    prestacion.tipo,
                                    prestacion.nombre,
                                    prestacion.costo
                                );

                                resultados.push({
                                    medicoId: medico._id,
                                    medico: medico.nombre,
                                    ...(prestacion.tipo === TipoPrestacion.ESPECIALIDAD
                                        ? { especialidad: prestacion.nombre }
                                        : { practica: prestacion.nombre }),
                                    fechaHora: new Date(fechaSlot),
                                    sede: sedeMedico,
                                    costoBase: prestacion.costo,
                                    costoEstimado: infoCobertura.costoEstimado,
                                    estadoCobertura: infoCobertura.estadoCobertura,
                                    porcentajeCobertura: infoCobertura.porcentajeCobertura
                                });
                            }
                        }
                    }
                }
            }
        }

        // Ordenar por fecha o costo estimado
        resultados.sort((a, b) => {
            if (sortBy === 'costoEstimado') {
                return order === 'asc'
                    ? a.costoEstimado - b.costoEstimado
                    : b.costoEstimado - a.costoEstimado;
            }
            return order === 'asc'
                ? new Date(a.fechaHora) - new Date(b.fechaHora)
                : new Date(b.fechaHora) - new Date(a.fechaHora);
        });

        // Paginar
        const total = resultados.length;
        const paginados = resultados.slice((page - 1) * limit, page * limit);

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            resultados: paginados
        };
    }

    async crearTurno(data) {
        const medico = await this.medicoRepo.findById(data.medicoId);

        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }
        const fecha = new Date(data.fechaHora);
        const dia = obtenerDiaSemana(fecha);
        const hora = obtenerHora(fecha);
        const horaMins = horaAMinutos(hora);

        const disponibilidad = medico.disponibilidad.find(d =>
            d.diaSemana === dia &&
            horaAMinutos(d.horaDesde) <= horaMins &&
            horaMins < horaAMinutos(d.horaHasta)
        );
        if (!disponibilidad) {
            throw new BadRequestError("El medico solicitado no tiene disponibilidad para ese horario");
        }

        const yaExisteTurno = await this.turnoRepo.existeTurno(medico._id, fecha);
        if (yaExisteTurno) {
            throw new ConflictError("Ya existe un turno para ese horario");
        }

        const sede = data.sede;
        medico.validarSedeSolicitada(sede);

        const practica = data.practica;
        medico.validarPracticaSolicitada(practica);

        const nuevoTurno = new Turno(medico._id, data.pacienteId, fecha, sede, practica, data.costo);

        const turnoGuardado = await this.turnoRepo.createTurno(nuevoTurno);

        await this.medicoRepo.agregarTurnoSolicitado(medico._id, turnoGuardado._id);

        await this.notificacionService.crear(medico._id, data.pacienteId, "Nuevo turno solicitado");

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

        const medico = await this.medicoRepo.findById(turno.medicoId);
        if (!medico) {
            throw new NotFoundError("Medico no encontrado");
        }

        turno.estado = EstadoTurno.CANCELADO;
        turno.historialEstados.push(EstadoTurno.CANCELADO);
        turno.motivoCancelacion = motivo;

        await this.turnoRepo.updateTurno(id, turno);

        medico.removerTurno(id);
        await this.medicoRepo.updateMedico(medico._id, medico);

        await this.notificacionService.crear(turno.pacienteId, turno.medicoId, "Su turno fue cancelado");

        return turno;
    }

    async realizarTurno(id) {
        const turno = await this.turnoRepo.findTurno(id);

        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }
        if (turno.historialEstados.includes(EstadoTurno.REALIZADO)) {
            throw new ConflictError("No se puede realizar un turno realizado");
        }
        if (turno.historialEstados.includes(EstadoTurno.CANCELADO)) {
            throw new ConflictError("No se puede realizar un turno cancelado");
        }

        const medico = await this.medicoRepo.findById(turno.medicoId);
        if (!medico) {
            throw new NotFoundError("Medico no encontrado");
        }

        turno.estado = EstadoTurno.REALIZADO;
        turno.historialEstados.push(EstadoTurno.REALIZADO);

        await this.turnoRepo.updateTurno(id, turno);

        medico.removerTurno(id);
        await this.medicoRepo.updateMedico(medico._id, medico);

        return turno;
    }

    async modificarTurnoPorMedico(id, cambios) {
        const turno = await this.turnoRepo.findTurno(id);

        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }
        if (turno.EstadoTurno === EstadoTurno.CONFIRMADO){
            throw new ConflictError("No se puede modificar un turno confirmado");
        }
        if (turno.estado === EstadoTurno.CANCELADO || turno.estado === EstadoTurno.REALIZADO){
            throw new ConflictError("Este turno ya fue finalizado");
        }

        const cambiosPermitidos = {};

        if (cambios.fechaHora) {
            const nuevaFecha = new Date(cambios.fechaHora);

            if (isNaN(nuevaFecha.getTime())) {
                throw new BadRequestError("La fecha es inválida");
            }
            if (nuevaFecha < new Date()) {
                throw new BadRequestError("La fecha no puede ser anterior a la actual");
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

        const medico = await this.medicoRepo.findById(turno.medicoId);
        const fecha = new Date(nuevaFechaHora);
        const dia = obtenerDiaSemana(fecha);
        const hora = obtenerHora(fecha);
        const horaMins = horaAMinutos(hora);

        const disponibilidad = medico.disponibilidad.find(d =>
            d.diaSemana === dia &&
            horaAMinutos(d.horaDesde) <= horaMins &&
            horaMins < horaAMinutos(d.horaHasta)
        );
        if (!disponibilidad) {
            throw new BadRequestError("El médico no tiene disponibilidad para el nuevo horario");
        }

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

// ─── Helpers de dominio ───────────────────────────────────────────────────────

const obtenerPrestacionesConCosto = (medico, especialidad, practica) => {
    const prestaciones = [];

    if (especialidad) {
        const match = medico.especialidades.find(
            e => e.nombre.toLowerCase() === especialidad.toLowerCase()
        );
        if (match) {
            prestaciones.push({
                tipo: TipoPrestacion.ESPECIALIDAD,
                nombre: match.nombre,
                costo: match.costoConsulta,
                duracionTurnoEnMins: match.duracionTurnoEnMins
            });
        }
    } else if (practica) {
        const match = medico.practicas.find(
            p => p.nombre.toLowerCase() === practica.toLowerCase()
        );
        if (match) {
            prestaciones.push({
                tipo: TipoPrestacion.PRACTICA,
                nombre: match.nombre,
                costo: match.costo,
                duracionTurnoEnMins: match.duracionTurnoEnMins
            });
        }
    } else {
        for (const e of medico.especialidades) {
            prestaciones.push({
                tipo: TipoPrestacion.ESPECIALIDAD,
                nombre: e.nombre,
                costo: e.costoConsulta,
                duracionTurnoEnMins: e.duracionTurnoEnMins
            });
        }
        for (const p of medico.practicas) {
            prestaciones.push({
                tipo: TipoPrestacion.PRACTICA,
                nombre: p.nombre,
                costo: p.costo,
                duracionTurnoEnMins: p.duracionTurnoEnMins
            });
        }
    }

    return prestaciones;
};

const generarSlots = (fecha, horaDesde, horaHasta, duracionMins) => {
    const slots = [];
    let horaActual = horaDesde;

    while (true) {
        const siguiente = agregarMinutos(horaActual, duracionMins);
        if (siguiente > horaHasta) break;
        slots.push(construirFechaHora(fecha, horaActual));
        horaActual = siguiente;
    }

    return slots;
};

const horaAMinutos = (hora) => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
};

const agregarMinutos = (hora, mins) => {
    const [h, m] = hora.split(':').map(Number);
    const totalMins = h * 60 + m + mins;
    const hh = Math.floor(totalMins / 60).toString().padStart(2, '0');
    const mm = (totalMins % 60).toString().padStart(2, '0');
    return `${hh}:${mm}`;
};

// ─── Validaciones ─────────────────────────────────────────────────────────────

const validaCancelable = (turno) => {
    if (turno.historialEstados.includes(EstadoTurno.REALIZADO)) {
        throw new ConflictError("No se puede operar sobre un turno realizado");
    }
    if (turno.historialEstados.includes(EstadoTurno.CANCELADO)) {
        throw new ConflictError("No se puede operar sobre un turno cancelado");
    }
};

const validaAnticipacion = (fechaHora) => {
    const diferenciaMs = new Date(fechaHora) - new Date();
    if (diferenciaMs < 60 * 60 * 1000) {
        throw new BadRequestError("Se requiere al menos 1 hora de anticipación");
    }
};

const obtenerDiaSemana = (fecha) => {
    const dias = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
    return dias[fecha.getDay()];
};

const obtenerHora = (fecha) => {
    return fecha.toTimeString().slice(0, 5);
};

const construirFechaHora = (fecha, hora) => {
    const [h, m] = hora.split(":");
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(Number(h));
    nuevaFecha.setMinutes(Number(m));
    nuevaFecha.setSeconds(0);
    nuevaFecha.setMilliseconds(0);
    return nuevaFecha;
};
