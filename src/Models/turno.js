export const EstadoTurno = {
    DISPONIBLE: "DISPONIBLE",
    RESERVADO: "RESERVADO",
    CONFIRMADO: "CONFIRMADO",
    CANCELADO: "CANCELADO",
    REALIZADO: "REALIZADO",
    REPROGRAMADO: "REPROGRAMADO"
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
    motivoCancelacion;

    constructor(medicoId, pacienteId, fechaHora, sede, practica, costo, motivoCancelacion) {
        this.medicoId = medicoId;
        this.pacienteId = pacienteId;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.practica = practica;
        this.estado = EstadoTurno.RESERVADO;
        this.historialEstados = [EstadoTurno.RESERVADO];
        this.costo = costo;
        this.motivoCancelacion = motivoCancelacion;
    }

}
