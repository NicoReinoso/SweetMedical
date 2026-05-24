import { jest } from "@jest/globals";
import { MedicoService } from "../src/Services/medicoService.js";
import Especialidad from "../src/Models/especialidad.js";
import Practica from "../src/Models/practica.js";
import {
    ConflictError,
    NotFoundError,
    UnprocessableEntityError,
} from "../src/errors/AppError.js";
 

const makeMedicoMock = (overrides = {}) => ({
    especialidades: [],
    practicas: [],
    agregarEspecialidad: jest.fn(function (e) { this.especialidades.push(e); }),
    agregarPractica:    jest.fn(function (p) { this.practicas.push(p); }),
    ...overrides,
});
 

// GESTION DE ESPECIALIDADES
 
describe("MedicoService - Especialidades", () => {
 
    let medicoService;
    let medicoRepoMock;
 
    beforeEach(() => {
        medicoRepoMock = {
            findById:             jest.fn(),
            updateEspecialidades: jest.fn().mockResolvedValue(),
        };
        medicoService = new MedicoService({ medicoRepo: medicoRepoMock });
    });
 
 
    describe("agregarEspecialidad", () => {
 
        test("debería agregar una especialidad válida y retornarla", async () => {
            const especialidad = new Especialidad("Cardiología", 30, 5000);
            const medicoMock   = makeMedicoMock({ _id: "med-1" });
            medicoRepoMock.findById.mockResolvedValue(medicoMock);
 
            const resultado = await medicoService.agregarEspecialidad("med-1", especialidad);
 
            expect(medicoMock.agregarEspecialidad).toHaveBeenCalledWith(especialidad);
            expect(medicoRepoMock.updateEspecialidades).toHaveBeenCalledWith("med-1", medicoMock.especialidades);
            expect(resultado).toEqual(especialidad);
        });
 
        test("debería lanzar ConflictError si la especialidad ya existe en el médico", async () => {
            const especialidad = new Especialidad("Cardiología", 30, 5000);
            const { Medico } = await import("../src/Models/medico.js");
            const medicoReal  = new Medico("u1", 123, "Dr. Test", [especialidad], [], ["Sede A"]);
            medicoRepoMock.findById.mockResolvedValue(medicoReal);
 
            await expect(
                medicoService.agregarEspecialidad("med-1", especialidad)
            ).rejects.toThrow(ConflictError);
        });
    });

 
    describe("modificarEspecialidad", () => {
 
        test("debería modificar duracionTurnoEnMins y costoConsulta correctamente", async () => {
            const fakeId = "esp-1";
            const especialidadExistente = {
                _id: { toString: () => fakeId },
                duracionTurnoEnMins: 30,
                costoConsulta: 5000,
            };
            medicoRepoMock.findById.mockResolvedValue(makeMedicoMock({ especialidades: [especialidadExistente] }));
 
            const modificada = { _id: fakeId, duracionTurnoEnMins: 45, costoConsulta: 7000 };
            const resultado  = await medicoService.modificarEspecialidad("med-1", modificada);
 
            expect(especialidadExistente.duracionTurnoEnMins).toBe(45);
            expect(especialidadExistente.costoConsulta).toBe(7000);
            expect(resultado).toEqual(modificada);
        });
 
        test("debería lanzar NotFoundError si la especialidad no pertenece al médico", async () => {
            medicoRepoMock.findById.mockResolvedValue(
                makeMedicoMock({ especialidades: [{ _id: { toString: () => "otro-id" } }] })
            );
 
            await expect(
                medicoService.modificarEspecialidad("med-1", { _id: "id-inexistente" })
            ).rejects.toThrow(NotFoundError);
        });
    });

 
    describe("bajaEspecialidad", () => {
 
        test("debería eliminar solo la especialidad indicada y retornar la lista actualizada", async () => {
            medicoRepoMock.findById.mockResolvedValue(makeMedicoMock({
                especialidades: [
                    { _id: { toString: () => "esp-1" }, nombre: "Cardiología" },
                    { _id: { toString: () => "esp-2" }, nombre: "Neurología" },
                ],
            }));
 
            const resultado = await medicoService.bajaEspecialidad("med-1", "esp-1");
 
            expect(resultado).toHaveLength(1);
            expect(resultado[0].nombre).toBe("Neurología");
            expect(medicoRepoMock.updateEspecialidades).toHaveBeenCalledWith("med-1", resultado);
        });
 
        test("debería lanzar NotFoundError si el médico no existe", async () => {
            medicoRepoMock.findById.mockResolvedValue(null);
 
            await expect(
                medicoService.bajaEspecialidad("med-inexistente", "esp-1")
            ).rejects.toThrow(NotFoundError);
        });
    });
});
 
// GESTION DE PRACTICAS
 
describe("MedicoService - Prácticas", () => {
 
    let medicoService;
    let medicoRepoMock;
 
    beforeEach(() => {
        medicoRepoMock = {
            findById:        jest.fn(),
            updatePracticas: jest.fn().mockResolvedValue(),
        };
        medicoService = new MedicoService({ medicoRepo: medicoRepoMock });
    });
 
 
    describe("agregarPractica", () => {
 
        test("debería agregar una práctica válida y retornarla", async () => {
            const practica   = new Practica("Electrocardiograma", "ECG-001", 20, 3000);
            const medicoMock   = makeMedicoMock({ _id: "med-1" });
            medicoRepoMock.findById.mockResolvedValue(medicoMock);
 
            const resultado = await medicoService.agregarPractica("med-1", practica);
 
            expect(medicoMock.agregarPractica).toHaveBeenCalledWith(practica);
            expect(medicoRepoMock.updatePracticas).toHaveBeenCalledWith("med-1", medicoMock.practicas);
            expect(resultado).toEqual(practica);
        });
 
        test("debería lanzar UnprocessableEntityError si la práctica es inválida (null)", async () => {
            const { Medico } = await import("../src/Models/medico.js");
            const medicoReal  = new Medico("u1", 123, "Dr. Test", [], [], ["Sede A"]);
            medicoRepoMock.findById.mockResolvedValue(medicoReal);
 
            await expect(
                medicoService.agregarPractica("med-1", null)
            ).rejects.toThrow(UnprocessableEntityError);
        });
    });
 
 
    describe("modificarPractica", () => {
 
        test("debería modificar duracionTurnoEnMins y costo correctamente", async () => {
            const fakeId = "prac-1";
            const practicaExistente = {
                _id: { toString: () => fakeId },
                duracionTurnoEnMins: 20,
                costo: 3000,
            };
            medicoRepoMock.findById.mockResolvedValue(makeMedicoMock({ practicas: [practicaExistente] }));
 
            const modificada = { _id: fakeId, duracionTurnoEnMins: 40, costo: 4500 };
            const resultado  = await medicoService.modificarPractica("med-1", modificada);
 
            expect(practicaExistente.duracionTurnoEnMins).toBe(40);
            expect(practicaExistente.costo).toBe(4500);
            expect(resultado).toEqual(modificada);
        });
 
        test("debería lanzar NotFoundError si el médico no existe", async () => {
            medicoRepoMock.findById.mockResolvedValue(null);
 
            await expect(
                medicoService.modificarPractica("med-inexistente", { _id: "x" })
            ).rejects.toThrow(NotFoundError);
        });
    });
 
 
    describe("bajaPractica", () => {
 
        test("debería eliminar solo la práctica indicada y retornar la lista actualizada", async () => {
            medicoRepoMock.findById.mockResolvedValue(makeMedicoMock({
                practicas: [
                    { _id: { toString: () => "prac-1" }, nombre: "Electrocardiograma" },
                    { _id: { toString: () => "prac-2" }, nombre: "Ecografía" },
                ],
            }));
 
            const resultado = await medicoService.bajaPractica("med-1", "prac-1");
 
            expect(resultado).toHaveLength(1);
            expect(resultado[0].nombre).toBe("Ecografía");
            expect(medicoRepoMock.updatePracticas).toHaveBeenCalledWith("med-1", resultado);
        });
 
        test("debería lanzar NotFoundError si el médico no existe", async () => {
            medicoRepoMock.findById.mockResolvedValue(null);
 
            await expect(
                medicoService.bajaPractica("med-inexistente", "prac-1")
            ).rejects.toThrow(NotFoundError);
        });
    });
});