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

    constructor(id, medico, paciente, fechaHora, sede, practica, costo) {
        this.id = id;
        this.medico = medico;
        this.paciente = paciente;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.practica = practica;
        this.estado = EstadoTurno.RESERVADO;
        this.historialEstados = [EstadoTurno.RESERVADO];
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