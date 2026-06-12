// tests/modeloMedico.test.js
import { Medico } from "../src/Models/medico.js";
import Disponibilidad from "../src/Models/disponibilidad.js";
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError
} from "../src/errors/AppError.js";

describe("Modelo Medico", () => {

    let medico;

    beforeEach(() => {
        medico = new Medico(
            "usuario1",
            12345,
            "Dr House",
            ["Clinica"],
            ["Consulta"],
            ["Sede Central"]
        );
    });

    describe("agregarDisponibilidad", () => {

        test("deberia agregar una disponibilidad valida", () => {
            const disponibilidad = new Disponibilidad(
                "LUNES",
                "08:00",
                "09:00"
            );

            medico.agregarDisponibilidad(disponibilidad);

            expect(medico.disponibilidad).toHaveLength(1);
            expect(medico.disponibilidad[0]).toEqual(disponibilidad);
        });

        test("deberia lanzar error si la disponibilidad es invalida", () => {
            expect(() => {
                medico.agregarDisponibilidad(null);
            }).toThrow(UnprocessableEntityError);
        });

        test("deberia lanzar error si horaDesde es mayor a horaHasta", () => {
            const disponibilidad = new Disponibilidad(
                "LUNES",
                "10:00",
                "09:00"
            );

            expect(() => {
                medico.agregarDisponibilidad(disponibilidad);
            }).toThrow(BadRequestError);
        });

        test("deberia lanzar error si la disponibilidad ya existe", () => {
            const disponibilidad = new Disponibilidad(
                "LUNES",
                "08:00",
                "09:00"
            );

            medico.agregarDisponibilidad(disponibilidad);

            expect(() => {
                medico.agregarDisponibilidad(disponibilidad);
            }).toThrow(ConflictError);
        });

    });

    describe("validarSedeSolicitada", () => {

        test("deberia validar una sede existente", () => {
            expect(() => {
                medico.validarSedeSolicitada("Sede Central");
            }).not.toThrow();
        });

        test("deberia lanzar error si la sede no existe", () => {
            expect(() => {
                medico.validarSedeSolicitada("Sede Norte");
            }).toThrow(BadRequestError);
        });

    });

    describe("validarPracticaSolicitada", () => {

        test("deberia validar una practica existente", () => {
            expect(() => {
                medico.validarPracticaSolicitada("Consulta");
            }).not.toThrow();
        });

        test("deberia lanzar error si la practica no existe", () => {
            expect(() => {
                medico.validarPracticaSolicitada("Cirugia");
            }).toThrow(BadRequestError);
        });

    });

    describe("aceptarTurno", () => {

        test("deberia mover un turno de solicitados a aceptados", () => {

            const turno = {
                id: "1",
                estado: "RESERVADO",
                historialEstados: ["RESERVADO"]
            };

            medico.turnosSolicitados.push(turno);

            medico.aceptarTurno("1");

            expect(medico.turnosSolicitados).toHaveLength(0);
            expect(medico.turnosAceptados).toHaveLength(1);
            expect(medico.turnosAceptados[0].estado)
                .toBe("CONFIRMADO");
        });

        test("deberia lanzar error si el turno no existe", () => {
            expect(() => {
                medico.aceptarTurno("999");
            }).toThrow(NotFoundError);
        });

    });

    describe("removerTurnoFinalizado", () => {

        test("deberia remover un turno de solicitados", () => {

            const turno = { id: "1" };

            medico.turnosSolicitados.push(turno);

            medico.removerTurno("1");

            expect(medico.turnosSolicitados).toHaveLength(0);
        });

        test("deberia remover un turno de aceptados", () => {

            const turno = { id: "2" };

            medico.turnosAceptados.push(turno);

            medico.removerTurno("2");

            expect(medico.turnosAceptados).toHaveLength(0);
        });

    });

});