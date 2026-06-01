import { EstadoTurno, Turno } from "../Models/turno.js"
import { MedicoService } from "./medicoService.js"
import { PacienteService } from "./pacienteService.js"
import { TurnoRepo } from "../Repositorio/turnoBd.js"
import {
    BadRequestError,
    ConflictError,
    NotFoundError
} from "../errors/AppError.js"
import { NotificacionService } from "./notificacionService.js"

export class TurnoService {
    constructor({
        turnoRepo,
        medicoService,
        notificacionService,
        pacienteService
    } = {}) {
        this.turnoRepo = turnoRepo;
        this.medicoService = medicoService;
        this.notificacionService = notificacionService;
        this.pacienteService = pacienteService;
    }

    async obtenerTurno(id) {
        const turno = await this.turnoRepo.findTurno(id);
        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }

        return turno;
    }

    async encontrarPorPaciente(pacienteId) {
        return await this.turnoRepo.findByPaciente(pacienteId);
    };

async buscarDisponibles(filtros) {

    const {
        pacienteId,
        medicoNombre,
        especialidad,
        practica,
        sede,
        fechaDesde,
        fechaHasta,

        sortBy = "fechaHora",
        order = "asc",

        page = 1,
        limit = 10

    } = filtros;

    const pagina = Number(page);
    const limite = Number(limit);

    // =========================
    // VALIDACIONES
    // =========================

    if (fechaDesde && isNaN(new Date(fechaDesde))) {
        throw new BadRequestError("fechaDesde inválida");
    }

    if (fechaHasta && isNaN(new Date(fechaHasta))) {
        throw new BadRequestError("fechaHasta inválida");
    }

    if (isNaN(pagina) || pagina < 1) {
        throw new BadRequestError("page inválido");
    }

    if (isNaN(limite) || limite < 1) {
        throw new BadRequestError("limit inválido");
    }

    if (practica && especialidad) {
        throw new BadRequestError(
            "No se puede buscar practica y especialidad a la vez"
        );
    }

    // =========================
    // PACIENTE
    // =========================

    let paciente = null;

    if (pacienteId) {

        paciente = await this.pacienteService.obtenerPaciente(pacienteId);

        if (!paciente) {
            throw new NotFoundError("Paciente no encontrado");
        }
    }

    // =========================
    // MEDICOS
    // =========================

    let medicos = await this.medicoService.obtenerTodos();

    if (medicoNombre) {
        medicos = medicos.filter(m => m.nombre === medicoNombre);
    }

    if (sede) {
        medicos = medicos.filter(m => m.sedes.includes(sede));
    }

    if (especialidad) {

        medicos = medicos.filter(m => m.especialidades.some(e => e.nombre === especialidad));
    }

    if (practica) {
        medicos = medicos.filter(m => m.practicas.some(p => p.nombre === practica));
    }

    // =========================
    // FECHAS
    // =========================

    const desde = fechaDesde
        ? new Date(fechaDesde)
        : new Date();

    const hasta = fechaHasta
        ? new Date(fechaHasta)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (desde > hasta) {
        throw new BadRequestError("fechaDesde no puede ser mayor a fechaHasta");
    }

    const resultados = [];

    // =========================
    // GENERACION TURNOS
    // =========================

    for (const medico of medicos) {

        // consultas posibles
        let consultas = [];

        // solo practica
        if (practica) {

            consultas = medico.practicas
                .filter(p => p.nombre === practica)
                .map(p => ({tipo: "PRACTICA",entidad: p}));
        }

        // solo especialidad
        else if (especialidad) {

            consultas = medico.especialidades
                .filter(e => e.nombre === especialidad)
                .map(e => ({tipo: "ESPECIALIDAD",entidad: e}));
        }

        // todas
        else {
            consultas = [
                ...medico.practicas.map(p => ({
                    tipo: "PRACTICA",
                    entidad: p
                })),

                ...medico.especialidades.map(e => ({
                    tipo: "ESPECIALIDAD",
                    entidad: e
                }))
            ];
        }

        // recorrer rango de fechas
        for (
            let fecha = new Date(desde);
            fecha <= hasta;
            fecha.setDate(fecha.getDate() + 1)
        ) {

            const diaSemana = obtenerDiaSemana(fecha);

            // disponibilidades de ese dia
            const disponibilidadesDia = medico.disponibilidad.filter(d => d.diaSemana === diaSemana);

            for (const disponibilidad of disponibilidadesDia) {

                const fechaSlot = construirFechaHora(fecha, disponibilidad.horaDesde);

                // validar ocupado
                const ocupado =await this.turnoRepo.existeTurno(medico._id, fechaSlot);

                if (ocupado) {
                    continue;
                }

                // generar turnos posibles
                // para cada consulta

                for (const consulta of consultas) {

                    let infoCosto = {

                        cobertura: "NO_CUBIERTO",

                        porcentajeCobertura: 0,

                        costoFinal:
                            consulta.entidad.costoBase ??
                            consulta.entidad.costo
                    };

                    // calcular cobertura
                    if (paciente) {
                        infoCosto = consulta.entidad.calcularCostoFinal(paciente);
                    }

                    resultados.push({

                        medicoId: medico._id,

                        medicoNombre: medico.nombre,

                        fechaHora: fechaSlot,

                        sede:
                            sede ||
                            medico.sedes[0],

                        consultaSolicitada: {
                            tipo: consulta.tipo,

                            nombre: consulta.entidad.nombre
                        },

                        estadoCobertura: infoCosto.cobertura,

                        porcentajeCobertura: infoCosto.porcentajeCobertura,

                        costoEstimado: infoCosto.costoFinal
                    });
                }
            }
        }
    }


    // =========================
    // ORDENAMIENTO
    // =========================

    if (sortBy === "fechaHora") {

        resultados.sort((a, b) => {

            const fechaA =
                new Date(a.fechaHora);

            const fechaB =
                new Date(b.fechaHora);

            return order === "asc"
                ? fechaA - fechaB
                : fechaB - fechaA;
        });
    }

    if (sortBy === "costoEstimado") {

        resultados.sort((a, b) => {

            return order === "asc"
                ? a.costoEstimado - b.costoEstimado
                : b.costoEstimado - a.costoEstimado;
        });
    }

    // =========================
    // PAGINACION
    // =========================

    const inicio = (pagina - 1) * limite;

    const fin = inicio + limite;

    const resultadosPaginados =
        resultados.slice(inicio, fin);

    return {

        total: resultados.length,

        page: pagina,

        limit: limite,

        totalPages: Math.ceil(resultados.length / limite),

        resultados: resultadosPaginados
    };
}
        
    
    async crearTurno(data) {
        const medico = await this.medicoService.obtenerMedico(data.medicoId);

        if (!medico) {
            throw new NotFoundError("Médico no encontrado");
        }
        const fecha = new Date(data.fechaHora);
        const dia = obtenerDiaSemana(fecha);
        const hora = obtenerHora(fecha);

        // Valida que el horario caiga dentro de un bloque de disponibilidad del médico
        const disponibilidad = medico.disponibilidad.find(d =>
            d.diaSemana === dia &&
            horaEnRango(hora, d.horaDesde, d.horaHasta)
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

        const pacienteSolicitante = await this.pacienteService.obtenerPaciente(data.pacienteId);
        if (!pacienteSolicitante) {
            throw new NotFoundError("Paciente no encontrado");
        }

        if (!data.practica && !data.especialidad) {
            throw new BadRequestError("Se necesita la especialidad o practica para la que se requiere el turno");
        }
        if (data.practica && data.especialidad) {
            throw new ConflictError("No se puede crear un turno para una practica y especialidad a la vez");
        }

        let consultaSolicitada;
        let infoCosto;

        if (data.practica) {
            const practica = medico.practicas.find(p => p.nombre === data.practica);
            if (!practica) {
                throw new BadRequestError("El medico solicitado no realiza esa practica");
            }
            consultaSolicitada = practica;
            infoCosto = practica.calcularCostoFinal(pacienteSolicitante);
        } else {
            const especialidad = medico.especialidades.find(e => e.nombre === data.especialidad);
            if (!especialidad) {
                throw new BadRequestError("El medico solicitado no tiene esa especialidad");
            }
            consultaSolicitada = especialidad;
            infoCosto = especialidad.calcularCostoFinal(pacienteSolicitante);
        }

        const nuevoTurno = new Turno(
            medico.id,
            data.pacienteId,
            fecha,
            sede,
            consultaSolicitada,
            infoCosto.costoFinal
        );

        const turnoGuardado = await this.turnoRepo.createTurno(nuevoTurno);

        await this.medicoService.agregarTurno(medico._id, turnoGuardado._id);

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

        const medico = await this.medicoService.obtenerMedico(turno.medicoId);
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

        await this.medicoService.actualizarMedico(medico.id, medico);

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

        const medico = await this.medicoService.obtenerMedico(turno.medicoId);
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
        await this.medicoService.actualizarMedico(medico.id, medico);

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

        if (cambios.consultaSolicitada) {
            cambiosPermitidos.consultaSolicitada = cambios.consultaSolicitada;
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
        const medico = await this.medicoService.obtenerMedico(turno.medicoId);
        const fecha = new Date(nuevaFechaHora);
        const dia = obtenerDiaSemana(fecha);
        const hora = obtenerHora(fecha);

        const disponibilidad = medico.disponibilidad.find(d =>
            d.diaSemana === dia &&
            horaEnRango(hora, d.horaDesde, d.horaHasta)
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
    const hora = fecha.getUTCHours(); // "HH:MM"
    const minutos = fecha.getUTCMinutes();
    return `${String(hora).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
};

const construirFechaHora = (fecha, hora) => {
    const [h, m] = hora.split(":").map(Number);

    const nuevaFecha = new Date(fecha);

    nuevaFecha.setUTCHours(h); // se usa setUTC para que no se aplique una conversión por zona horaria
    nuevaFecha.setUTCMinutes(m);
    nuevaFecha.setUTCSeconds(0);
    nuevaFecha.setUTCMilliseconds(0);

    return nuevaFecha;
};

const horaAMinutos = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
};

const minutosAHora = (minutos) => {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const horaEnRango = (hora, horaDesde, horaHasta) => {
    return hora >= horaDesde && hora < horaHasta;
};