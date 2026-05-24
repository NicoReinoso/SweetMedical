import { jest } from "@jest/globals";
import { TurnoService } from "../src/Services/turnoService.js";
import { EstadoTurno } from "../src/Models/turno.js";

// ── Mocks base ───────────────────────────────────────────────────────────────

const turnoMock = (overrides = {}) => ({
    _id: "turno-1",
    pacienteId: "pac-100",
    medicoId: "med-1",
    fechaHora: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 horas en el futuro
    sede: "Medrano",
    practica: "Cardio",
    estado: EstadoTurno.RESERVADO,
    historialEstados: [EstadoTurno.RESERVADO],
    motivoCancelacion: null,
    ...overrides
});

const medicoMock = {
    _id: "med-1",
    disponibilidad: [
        { diaSemana: "DOMINGO",   horaDesde: "09:00" },
        { diaSemana: "LUNES",     horaDesde: "09:00" },
        { diaSemana: "MARTES",    horaDesde: "09:00" },
        { diaSemana: "MIERCOLES", horaDesde: "09:00" },
        { diaSemana: "JUEVES",    horaDesde: "09:00" },
        { diaSemana: "VIERNES",   horaDesde: "09:00" },
        { diaSemana: "SABADO",    horaDesde: "09:00" },
    ],
    validarSedeSolicitada: jest.fn(),
    validarPracticaSolicitada: jest.fn(),
    removerTurno: jest.fn(),
};

const makeTurnoRepo = (overrides = {}) => ({
    findTurno: jest.fn().mockResolvedValue(turnoMock()),
    createTurno: jest.fn().mockImplementation(t => Promise.resolve({ _id: "turno-1", ...t })),
    updateTurno: jest.fn().mockImplementation((id, t) => Promise.resolve({ _id: id, ...t })),
    existeTurno: jest.fn().mockResolvedValue(null),
    findByPacienteId: jest.fn().mockResolvedValue([turnoMock()]),
    ...overrides
});

const makeMedicoRepo = (overrides = {}) => ({
    findById: jest.fn().mockResolvedValue(medicoMock),
    agregarTurnoSolicitado: jest.fn().mockResolvedValue(true),
    updateMedico: jest.fn().mockResolvedValue(true),
    ...overrides
});

const makeService = (turnoOverrides = {}, medicoOverrides = {}) =>
    new TurnoService(makeTurnoRepo(turnoOverrides), makeMedicoRepo(medicoOverrides));

// ── crearTurno ───────────────────────────────────────────────────────────────

describe("crearTurno", () => {
    const dataValida = {
        medicoId: "med-1",
        fechaHora: "2026-10-12T09:00:00",
        sede: "Medrano",
        practica: "Cardio",
        pacienteId: "pac-100",
        costo: 1500
    };

    test("debería crear un turno si el médico tiene disponibilidad", async () => {
        const service = makeService();
        const turno = await service.crearTurno(dataValida);

        expect(turno).toBeDefined();
        expect(turno.pacienteId).toBe("pac-100");
        expect(turno.estado).toBe(EstadoTurno.RESERVADO);
    });

    test("debería lanzar error si el médico no existe", async () => {
        const service = makeService({}, { findById: jest.fn().mockResolvedValue(null) });

        await expect(service.crearTurno(dataValida)).rejects.toThrow("Médico no encontrado");
    });

    test("debería lanzar error si el médico no tiene disponibilidad en ese horario", async () => {
        const service = makeService();

        await expect(service.crearTurno({
            ...dataValida,
            fechaHora: "2026-10-12T03:00:00"
        })).rejects.toThrow("El medico solicitado no tiene disponibilidad para ese horario");
    });

    test("debería lanzar error si ya existe un turno en ese horario", async () => {
        const service = makeService({
            existeTurno: jest.fn().mockResolvedValue(turnoMock())
        });

        await expect(service.crearTurno(dataValida)).rejects.toThrow("Ya existe un turno para ese horario");
    });
});

// ── cancelarTurnoConMotivo ────────────────────────────────────────────────────

describe("cancelarTurnoConMotivo", () => {
    test("debería cancelar el turno y guardar el motivo", async () => {
        const service = makeService();
        const turno = await service.cancelarTurnoConMotivo("turno-1", "No puedo asistir");

        expect(turno.estado).toBe(EstadoTurno.CANCELADO);
        expect(turno.motivoCancelacion).toBe("No puedo asistir");
        expect(turno.historialEstados).toContain(EstadoTurno.CANCELADO);
    });

    test("debería lanzar error si el turno no existe", async () => {
        const service = makeService({ findTurno: jest.fn().mockResolvedValue(null) });

        await expect(service.cancelarTurnoConMotivo("turno-inexistente", "motivo"))
            .rejects.toThrow("Turno no encontrado");
    });

    test("debería lanzar error si el turno ya está cancelado", async () => {
        const service = makeService({
            findTurno: jest.fn().mockResolvedValue(
                turnoMock({ estado: EstadoTurno.CANCELADO, historialEstados: [EstadoTurno.CANCELADO] })
            )
        });

        await expect(service.cancelarTurnoConMotivo("turno-1", "motivo"))
            .rejects.toThrow("No se puede operar sobre un turno cancelado");
    });

    test("debería lanzar error si el turno ya fue realizado", async () => {
        const service = makeService({
            findTurno: jest.fn().mockResolvedValue(
                turnoMock({ estado: EstadoTurno.REALIZADO, historialEstados: [EstadoTurno.REALIZADO] })
            )
        });

        await expect(service.cancelarTurnoConMotivo("turno-1", "motivo"))
            .rejects.toThrow("No se puede operar sobre un turno realizado");
    });

    test("debería lanzar error si faltan menos de 1 hora para el turno", async () => {
        const service = makeService({
            findTurno: jest.fn().mockResolvedValue(
                turnoMock({ fechaHora: new Date(Date.now() + 30 * 60 * 1000) })
            )
        });

        await expect(service.cancelarTurnoConMotivo("turno-1", "motivo"))
            .rejects.toThrow("Se requiere al menos 1 hora de anticipación");
    });
});

// ── reprogramarTurno ──────────────────────────────────────────────────────────

describe("reprogramarTurno", () => {
    const nuevaFecha = "2026-10-15T09:00:00";

    test("debería reprogramar el turno a la nueva fecha", async () => {
        const service = makeService();
        const turno = await service.reprogramarTurno("turno-1", nuevaFecha);

        expect(turno.estado).toBe(EstadoTurno.REPROGRAMADO);
        expect(turno.historialEstados).toContain(EstadoTurno.REPROGRAMADO);
        expect(new Date(turno.fechaHora).toISOString()).toBe(new Date(nuevaFecha).toISOString());
    });

    test("debería lanzar error si el turno no existe", async () => {
        const service = makeService({ findTurno: jest.fn().mockResolvedValue(null) });

        await expect(service.reprogramarTurno("turno-inexistente", nuevaFecha))
            .rejects.toThrow("Turno no encontrado");
    });

    test("debería lanzar error si el médico no tiene disponibilidad en la nueva fecha", async () => {
        const service = makeService();

        await expect(service.reprogramarTurno("turno-1", "2026-10-15T03:00:00"))
            .rejects.toThrow("El médico no tiene disponibilidad para el nuevo horario");
    });

    test("debería lanzar error si ya existe un turno en el nuevo horario", async () => {
        const service = makeService({
            existeTurno: jest.fn().mockResolvedValue(turnoMock())
        });

        await expect(service.reprogramarTurno("turno-1", nuevaFecha))
            .rejects.toThrow("Ya existe un turno para el nuevo horario solicitado");
    });
});

// ── getHistorialPaciente ──────────────────────────────────────────────────────

describe("getHistorialPaciente", () => {
    test("debería retornar los turnos del paciente", async () => {
        const service = makeService();
        const turnos = await service.getHistorialPaciente("pac-100");

        expect(Array.isArray(turnos)).toBe(true);
        expect(turnos.length).toBeGreaterThan(0);
    });

    test("debería retornar array vacío si el paciente no tiene turnos", async () => {
        const service = makeService({
            findByPacienteId: jest.fn().mockResolvedValue([])
        });

        const turnos = await service.getHistorialPaciente("pac-sin-turnos");
        expect(turnos).toEqual([]);
    });
});