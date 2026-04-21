


export class TurnoService {
    constructor({turnoRepo = new TurnoRepo()} = {}) {
        this.turnoRepo = turnoRepo;
    }

    findById = (id) => {
        return this.turnoRepo.findById(id);
    }

    reservarTurno = (id, pacienteId) => {
        const turno = this.turnoRepo.findById(id);
        if (!turno) {
            throw new Error("Turno no encontrado");
        }
        if (turno.paciente !== null && turno.paciente.id !== pacienteId) {
            throw new Error("Turno ya reservado");
        }
        turno.paciente = pacienteId;
        turno.estado = EstadoTurno.RESERVADO;
        turno.historialEstados.push(EstadoTurno.RESERVADO);
        return turno;
    }

    cancelarTurno = (id) => {
        const turno = this.turnoRepo.findById(id);
        if (!turno) {
            throw new Error("Turno no encontrado");
        }
        turno.paciente = null;
        turno.estado = EstadoTurno.DISPONIBLE;
        turno.historialEstados.push(EstadoTurno.DISPONIBLE);
        return turno;
    }
}