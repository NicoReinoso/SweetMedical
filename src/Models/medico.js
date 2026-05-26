import Disponibilidad from "./disponibilidad.js";
import { EstadoTurno } from "./turno.js";
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError
} from "../errors/AppError.js"
import Especialidad from "./especialidad.js";
import Practica from "./practica.js"

export class Medico {
    usuario;
    matricula;
    nombre;
    especialidades;
    practicas;
    sedes;
    disponibilidad;
    turnosSolicitados;
    turnosAceptados;

    constructor(usuario, matricula, nombre, especialidades, practicas, sedes) {
        this.usuario = usuario
        this.matricula = matricula
        this.nombre = nombre.trim()
        this.especialidades = especialidades
        this.practicas = practicas
        this.sedes = sedes
        this.disponibilidad = []
        this.turnosSolicitados = []
        this.turnosAceptados = []
    }

    agregarDisponibilidad(nuevaDisponibilidad) {
        if (!nuevaDisponibilidad || !(nuevaDisponibilidad instanceof Disponibilidad)) {
            throw new UnprocessableEntityError("La disponibilidad es inválida");
        }
        this.validarCoherenciaHora(nuevaDisponibilidad.horaDesde, nuevaDisponibilidad.horaHasta);
        this.verificarDisponibilidadIgual(this.disponibilidad, nuevaDisponibilidad);

        this.disponibilidad.push(nuevaDisponibilidad);
    }

    aceptarTurno(idTurno) {
        const turno = this.turnosSolicitados.find(t => t.id === idTurno);
    

        if (!turno) {
            throw new NotFoundError("Turno no encontrado");
        }

        turno.estado = EstadoTurno.CONFIRMADO;
        turno.historialEstados.push(EstadoTurno.CONFIRMADO);
        
        //eliminar de solicitados
        this.turnosSolicitados = this.turnosSolicitados.filter(t => t.id !== idTurno);
        this.turnosAceptados.push(turno);
    }
    
    removerTurno(idTurno) {
        this.turnosSolicitados = this.turnosSolicitados.filter(
            t => t.id !== idTurno
        );

        this.turnosAceptados = this.turnosAceptados.filter(
            t => t.id !== idTurno
        );
    }
    
    agregarEspecialidad(nuevaEspecialidad){

        if (!nuevaEspecialidad || !(nuevaEspecialidad instanceof Especialidad)) {
            throw new UnprocessableEntityError("La especialidad es inválida");
        }

        if (this.especialidades.some(e => e.nombre === nuevaEspecialidad.nombre)) {
            throw new ConflictError("El médico ya tiene esa especialidad");
        }

        this.especialidades.push(nuevaEspecialidad);
    }

    agregarPractica(nuevaPractica){

        if (!nuevaPractica || !(nuevaPractica instanceof Practica)) {
            throw new UnprocessableEntityError("La practica es inválida");
        }

        if (this.practicas.some(p => p.nombre === nuevaPractica.nombre)) {
            throw new ConflictError("El médico ya tiene esa practica");
        }

        this.practicas.push(nuevaPractica);
    }
    
    //VALIDACIONES
    validarCoherenciaHora(horaDesde, horaHasta) {
        const desde = this.convertirHoraAMinutos(horaDesde);
        const hasta = this.convertirHoraAMinutos(horaHasta);

        if (desde >= hasta) {
            throw new BadRequestError("Rango horario inválido");
        }
    };

    convertirHoraAMinutos(hora) {
        const [h, m] = hora.split(":").map(Number);
        return h * 60 + m;
    };

    verificarDisponibilidadIgual(disponibilidades, nueva) {
        if (disponibilidades.some(d => d.diaSemana === nueva.diaSemana && d.horaDesde === nueva.horaDesde &&  d.horaHasta === nueva.horaHasta)) {
            throw new ConflictError("La disponibilidad ya existe");
        }
    };

    validarSedeSolicitada(sede) {
        if(!this.sedes.includes(sede)){
            throw new BadRequestError("El medico solicitado no opera en esa sede");
        }
    }

    validarPracticaSolicitada(practica) {
        if(!this.practicas.some(p => p.nombre === practica.nombre)){
            throw new BadRequestError("El medico solicitado no realiza esa practica");
        }
    }

    validarEspecialidadSolicitada(especialidad) {
        if(!this.especialidades.some(e => e.nombre === especialidad.nombre)){
            throw new BadRequestError("El medico solicitado no tiene esa especialidad");
        }
    }

}