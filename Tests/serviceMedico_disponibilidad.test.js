import { jest } from "@jest/globals";
import { MedicoService } from "../src/Services/medicoService.js";
import Disponibilidad from "../src/Models/disponibilidad.js";
import {
    ConflictError,
    NotFoundError
} from "../src/errors/AppError.js";

describe("MedicoService", () => {

    let medicoService;
    let medicoRepoMock;

    beforeEach(() => {

        medicoRepoMock = {
            findById: jest.fn(),
            updateDisponibilidad: jest.fn()
        };

        medicoService = new MedicoService({ medicoRepo: medicoRepoMock });
    });

    describe("obtenerDisponibilidad", () => {

        test("deberia devolver las disponibilidades del medico", async () => {

            const medicoMock = {
                disponibilidad: [
                    new Disponibilidad("LUNES", "08:00", "09:00")
                ]
            };

            medicoRepoMock.findById.mockResolvedValue(medicoMock);

            const resultado =
                await medicoService.obtenerDisponibilidad("1");

            expect(resultado).toEqual(medicoMock.disponibilidad);

            expect(medicoRepoMock.findById)
                .toHaveBeenCalledWith("1");
        });

        test("deberia lanzar error si el medico no existe", async () => {

            medicoRepoMock.findById.mockResolvedValue(null);

            await expect(
                medicoService.obtenerDisponibilidad("1")
            ).rejects.toThrow(NotFoundError);
        });

    });

    describe("agregarDisponibilidad", () => {

        test("deberia agregar una disponibilidad correctamente", async () => {

            const disponibilidad = new Disponibilidad(
                "LUNES",
                "08:00",
                "09:00"
            );

            const medicoMock = {
                disponibilidad: [],
                agregarDisponibilidad: jest.fn()
            };

            medicoRepoMock.findById.mockResolvedValue(medicoMock);

            const resultado =
                await medicoService.agregarDisponibilidad(
                    "1",
                    disponibilidad
                );

            expect(medicoMock.agregarDisponibilidad)
                .toHaveBeenCalledWith(disponibilidad);

            expect(resultado).toEqual(disponibilidad);
        });

        test("deberia lanzar error si el medico no existe", async () => {

            medicoRepoMock.findById.mockResolvedValue(null);

            const disponibilidad = new Disponibilidad(
                "LUNES",
                "08:00",
                "09:00"
            );

            await expect(
                medicoService.agregarDisponibilidad(
                    "1",
                    disponibilidad
                )
            ).rejects.toThrow(NotFoundError);
        });

    });

    describe("bajaDisponibilidad", () => {

        test("deberia eliminar una disponibilidad correctamente", async () => {

            const disponibilidad = {
                diaSemana: "LUNES",
                horaDesde: "08:00",
                horaHasta: "09:00",
                ocupado: false
            };

            const medicoMock = {
                disponibilidad: [disponibilidad]
            };

            medicoRepoMock.findById.mockResolvedValue(medicoMock);

            medicoRepoMock.updateDisponibilidad
                .mockResolvedValue([]);

            await medicoService.bajaDisponibilidad(
                "1",
                disponibilidad
            );

            expect(
                medicoRepoMock.updateDisponibilidad
            ).toHaveBeenCalled();
        });

        test("deberia lanzar error si el medico no existe", async () => {

            medicoRepoMock.findById.mockResolvedValue(null);

            await expect(
                medicoService.bajaDisponibilidad(
                    "1",
                    {}
                )
            ).rejects.toThrow(NotFoundError);
        });

        test("deberia lanzar error si la disponibilidad no existe", async () => {

            const medicoMock = {
                disponibilidad: []
            };

            medicoRepoMock.findById.mockResolvedValue(medicoMock);

            await expect(
                medicoService.bajaDisponibilidad(
                    "1",
                    {
                        diaSemana: "LUNES",
                        horaDesde: "08:00",
                        horaHasta: "09:00"
                    }
                )
            ).rejects.toThrow(ConflictError);
        });

        test("deberia lanzar error si la disponibilidad esta ocupada", async () => {

            const disponibilidad = {
                diaSemana: "LUNES",
                horaDesde: "08:00",
                horaHasta: "09:00",
                ocupado: true
            };

            const medicoMock = {
                disponibilidad: [disponibilidad]
            };

            medicoRepoMock.findById.mockResolvedValue(medicoMock);

            await expect(
                medicoService.bajaDisponibilidad(
                    "1",
                    disponibilidad
                )
            ).rejects.toThrow(ConflictError);
        });

    });

});