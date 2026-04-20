import Disponibilidad from "./disponibilidad.js";

export class Medico {
    id;
    nombre;
    disponibilidad;

    constructor(id, nombre) {
        this.id = id
        this.nombre = nombre.trim()
        this.disponibilidad = []
    }

    agregarDisponibilidad(nuevaDisponibilidad) {
        if (!nuevaDisponibilidad || !(nuevaDisponibilidad instanceof Disponibilidad)) {
            throw new Error("La disponibilidad es inválida");
        }
        if (!this.validarFormato(nuevaDisponibilidad.horaDesde) || !this.validarFormato(nuevaDisponibilidad.horaHasta)) {
            throw new Error("Formato de hora inválido, el formato de hora es hh:mm");
        }
        this.validarCoherenciaHora(nuevaDisponibilidad.horaDesde, nuevaDisponibilidad.horaHasta);
        this.verificarDisponibilidadIgual(this.disponibilidad, nuevaDisponibilidad);

        this.disponibilidad.push(nuevaDisponibilidad);
    }

    validarFormato = (hora) => {
        const regex = /^([01]?\d|2[0-3]):[0-5]\d$/; //se acepta en formato hh:mm
        return regex.test(hora);
    };

    validarCoherenciaHora = (horaDesde, horaHasta) => {
        const desde = this.convertirHoraAMinutos(horaDesde);
        const hasta = this.convertirHoraAMinutos(horaHasta);

        if (desde >= hasta) {
            throw new Error("Rango horario inválido");
        }
    };

    convertirHoraAMinutos = (hora) => {
        const [h, m] = hora.split(":").map(Number);
        return h * 60 + m;
    };

    verificarDisponibilidadIgual = (disponibilidades, nueva) => {
        if (disponibilidades.some(d => d.diaSemana === nueva.diaSemana && d.horaDesde === nueva.horaDesde &&  d.horaHasta === nueva.horaHasta)) {
            throw new Error("La disponibilidad ya existe");
        }
    };

}