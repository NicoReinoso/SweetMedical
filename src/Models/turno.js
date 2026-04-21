export const EstadoTurno = {
    DISPONIBLE: "DISPONIBLE",
    RESERVADO: "RESERVADO",
    CONFIRMADO: "CONFIRMADO",
    CANCELADO: "CANCELADO",
    REALIZADO: "REALIZADO"
}

export class Turno {
    id;
    medico;
    paciente;
    fechaHora;
    sede;
    practica;
    estado;
    historialEstados;
    costo;

    constructor(id, medico, paciente = null, fechaHora, sede, practica, estado = EstadoTurno.DISPONIBLE, historialEstados = [EstadoTurno.DISPONIBLE], costo) {
        this.id = id;
        this.medico = medico;
        this.paciente = paciente;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.practica = practica;
        this.estado = estado;
        this.historialEstados = historialEstados;
        this.costo = costo;
    }

    crearTurno() {
        turnoRepo.createTurno(this);
    }

    actualizarTurno(turnoId, turno) {
        turnoRepo.updateTurno(turnoId, turno);
    }

    eliminarTurno(turnoId) {
        turnoRepo.deleteTurno(turnoId);
    }

}