export const EstadoTurno = {
    DISPONIBLE: "DISPONIBLE",
    RESERVADO: "RESERVADO",
    CONFIRMADO: "CONFIRMADO",
    CANCELADO: "CANCELADO",
    REALIZADO: "REALIZADO"
}

export class Turno {
    medico;
    pacienteId;
    fechaHora;
    sede;
    practica;
    estado;
    historialEstados;
    costo;

    constructor(medicoId, pacienteId, fechaHora, sede, practica, costo) {
        this.medicoId = medicoId;
        this.pacienteId = pacienteId;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.practica = practica;
        this.estado = EstadoTurno.RESERVADO;
        this.historialEstados = [EstadoTurno.RESERVADO];
        this.costo = costo;
    }

}
