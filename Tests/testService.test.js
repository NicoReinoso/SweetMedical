// Tests/testTurno.test.js
import { jest } from "@jest/globals";
import { TurnoService } from "../src/Services/turnoService.js";
import { EstadoTurno } from "../src/Models/turno.js";

describe("TurnoService", () => {

    let turnoRepoMock;
    let medicoRepoMock;
    let pacienteRepoMock;
    let notificacionServiceMock;

    let service;

    beforeEach(() => {

        turnoRepoMock = {
            findTurno: jest.fn(),
            createTurno: jest.fn(),
            updateTurno: jest.fn(),
            existeTurno: jest.fn(),
            findByPacienteId: jest.fn()
        };

        medicoRepoMock = {
            findById: jest.fn(),
            findAll: jest.fn(),
            agregarTurnoSolicitado: jest.fn(),
            updateMedico: jest.fn()
        };

        pacienteRepoMock = {
            findById: jest.fn()
        };

        notificacionServiceMock = {
            crear: jest.fn()
        };

        service = new TurnoService({
            turnoRepo: turnoRepoMock,
            medicoRepo: medicoRepoMock,
            pacienteRepo: pacienteRepoMock,
            notificacionService: notificacionServiceMock
        });
    });

    // =====================================================
    // CREAR TURNO
    // =====================================================

    describe("crearTurno", () => {

        test("debería crear un turno correctamente", async () => {

            const practicaMock = {
                nombre: "Cardio",

                calcularCostoFinal: jest.fn().mockReturnValue({
                    cobertura: "CUBIERTO",
                    porcentajeCobertura: 100,
                    costoFinal: 0
                })
            };

            const medicoMock = {
                _id: "med-1",

                disponibilidad: [
                    {
                        diaSemana: "LUNES",
                        horaDesde: "09:00"
                    }
                ],

                practicas: [practicaMock],

                especialidades: [],

                validarSedeSolicitada: jest.fn(),
                validarPracticaSolicitada: jest.fn()
            };

            medicoRepoMock.findById.mockResolvedValue(medicoMock);

            pacienteRepoMock.findById.mockResolvedValue({
                _id: "pac-1"
            });

            turnoRepoMock.existeTurno.mockResolvedValue(false);

            turnoRepoMock.createTurno.mockImplementation(async turno => ({
                ...turno,
                _id: "turno-1"
            }));

            const data = {
                medicoId: "med-1",
                pacienteId: "pac-1",
                fechaHora: "2026-10-12T09:00:00",
                sede: "Medrano",
                practica: "Cardio"
            };

            const turno = await service.crearTurno(data);

            expect(turno).toBeDefined();

            expect(turnoRepoMock.createTurno).toHaveBeenCalled();

            expect(notificacionServiceMock.crear).toHaveBeenCalled();
        });

        test("debería lanzar error si el médico no existe", async () => {

            medicoRepoMock.findById.mockResolvedValue(null);

            await expect(
                service.crearTurno({
                    medicoId: "med-1"
                })
            ).rejects.toThrow("Médico no encontrado");
        });

        test("debería lanzar error si no hay disponibilidad", async () => {

            medicoRepoMock.findById.mockResolvedValue({
                disponibilidad: [],
                practicas: [],
                especialidades: []
            });

            await expect(
                service.crearTurno({
                    medicoId: "med-1",
                    fechaHora: "2026-10-12T03:00:00"
                })
            ).rejects.toThrow(
                "El medico solicitado no tiene disponibilidad para ese horario"
            );
        });

        test("debería lanzar error si ya existe turno", async () => {

            medicoRepoMock.findById.mockResolvedValue({
                _id: "med-1",

                disponibilidad: [
                    {
                        diaSemana: "LUNES",
                        horaDesde: "09:00"
                    }
                ],

                practicas: [],
                especialidades: [],

                validarSedeSolicitada: jest.fn()
            });

            turnoRepoMock.existeTurno.mockResolvedValue(true);

            await expect(
                service.crearTurno({
                    medicoId: "med-1",
                    fechaHora: "2026-10-12T09:00:00",
                    sede: "Medrano"
                })
            ).rejects.toThrow(
                "Ya existe un turno para ese horario"
            );
        });
    });

    // =====================================================
    // CANCELAR TURNO
    // =====================================================

    describe("cancelarTurno", () => {

        test("debería cancelar un turno", async () => {

            const turnoMock = {
                _id: "turno-1",

                medico: "med-1",

                pacienteId: "pac-1",

                fechaHora: new Date(Date.now() + 3 * 60 * 60 * 1000),

                estado: EstadoTurno.RESERVADO,

                historialEstados: []
            };

            turnoRepoMock.findTurno.mockResolvedValue(turnoMock);

            medicoRepoMock.findById.mockResolvedValue({
                removerTurno: jest.fn(),
                id: "med-1"
            });

            turnoRepoMock.updateTurno.mockResolvedValue(turnoMock);

            const resultado = await service.cancelarTurno(
                "turno-1",
                "No puedo asistir"
            );

            expect(resultado.estado).toBe(
                EstadoTurno.CANCELADO
            );

            expect(turnoRepoMock.updateTurno).toHaveBeenCalled();
        });

        test("debería lanzar error si el turno no existe", async () => {

            turnoRepoMock.findTurno.mockResolvedValue(null);

            await expect(
                service.cancelarTurno("turno-1")
            ).rejects.toThrow("Turno no encontrado");
        });
    });

    // =====================================================
    // REPROGRAMAR
    // =====================================================

    describe("reprogramarTurno", () => {

        test("debería reprogramar un turno", async () => {

            const turnoMock = {
                _id: "turno-1",

                medicoId: "med-1",

                fechaHora: new Date(Date.now() + 3 * 60 * 60 * 1000),

                historialEstados: []
            };

            turnoRepoMock.findTurno.mockResolvedValue(turnoMock);

            medicoRepoMock.findById.mockResolvedValue({
                disponibilidad: [
                    {
                        diaSemana: "JUEVES",
                        horaDesde: "09:00"
                    }
                ]
            });

            turnoRepoMock.existeTurno.mockResolvedValue(false);

            turnoRepoMock.updateTurno.mockResolvedValue({
                ...turnoMock,
                estado: EstadoTurno.REPROGRAMADO
            });

            const resultado = await service.reprogramarTurno(
                "turno-1",
                "2026-10-15T09:00:00"
            );

            expect(resultado.estado).toBe(
                EstadoTurno.REPROGRAMADO
            );
        });
    });

    // =====================================================
    // BUSCAR DISPONIBLES
    // =====================================================

    describe("buscarDisponibles", () => {

        test("debería retornar disponibilidades", async () => {

            medicoRepoMock.findAll.mockResolvedValue([
                {
                    _id: "med-1",

                    nombre: "Juan",

                    especialidades: [
                        {
                            nombre: "Cardiologia"
                        }
                    ],

                    practicas: [
                        {
                            nombre: "Cardio"
                        }
                    ],

                    sedes: ["Medrano"],

                    disponibilidad: [
                        {
                            diaSemana: "LUNES",
                            horaDesde: "09:00",
                            horaHasta: "10:00"
                        }
                    ]
                }
            ]);

            const resultado = await service.buscarDisponibles({});

            expect(resultado.resultados.length).toBeGreaterThan(0);
        });

        test("debería filtrar por especialidad", async () => {

            medicoRepoMock.findAll.mockResolvedValue([
                {
                    _id: "med-1",

                    nombre: "Juan",

                    especialidades: [
                        {
                            nombre: "Cardiologia"
                        }
                    ],

                    practicas: [],

                    sedes: ["Medrano"],

                    disponibilidad: []
                }
            ]);

            const resultado = await service.buscarDisponibles({
                especialidad: "Cardiologia"
            });

            expect(resultado.resultados.length).toBe(0);
        });
    });

    // =====================================================
    // HISTORIAL PACIENTE
    // =====================================================

    describe("getHistorialPaciente", () => {

        test("debería retornar historial", async () => {

            turnoRepoMock.findByPacienteId.mockResolvedValue([
                {
                    _id: "turno-1"
                }
            ]);

            const resultado = await service.getHistorialPaciente("pac-1");

            expect(resultado.length).toBe(1);
        });
    });
});