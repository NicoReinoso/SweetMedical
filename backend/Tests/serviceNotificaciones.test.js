// Tests/notificacionService.test.js
import { jest } from "@jest/globals";
import { NotificacionService } from "../src/Services/notificacionService.js";
import { NotFoundError } from "../src/errors/AppError.js";

describe("NotificacionService", () => {

    let notificacionService;
    let notificacionRepoMock;

    beforeEach(() => {
        notificacionRepoMock = {
            findNoLeidas:       jest.fn(),
            findLeidas:         jest.fn(),
            setLeida:           jest.fn(),
            createNotificacion: jest.fn(),
        };
        notificacionService = new NotificacionService({ notificacionRepo: notificacionRepoMock });
    });


    describe("obtenerNoLeidas", () => {

        test("debería retornar la lista de notificaciones no leídas del usuario", async () => {
            const noLeidas = [
                { destinatarioId: "user-1", mensaje: "Turno confirmado", leida: false },
                { destinatarioId: "user-1", mensaje: "Recordatorio de turno", leida: false },
            ];
            notificacionRepoMock.findNoLeidas.mockResolvedValue(noLeidas);

            const resultado = await notificacionService.obtenerNoLeidas("user-1");

            expect(notificacionRepoMock.findNoLeidas).toHaveBeenCalledWith("user-1");
            expect(resultado).toEqual(noLeidas);
        });

        test("debería lanzar NotFoundError si el usuario no existe (repo retorna null)", async () => {
            notificacionRepoMock.findNoLeidas.mockResolvedValue(null);

            await expect(
                notificacionService.obtenerNoLeidas("user-inexistente")
            ).rejects.toThrow(NotFoundError);
        });
    });


    describe("obtenerLeidas", () => {

        test("debería retornar lista vacía si el usuario no tiene notificaciones leídas", async () => {
            notificacionRepoMock.findLeidas.mockResolvedValue([]);

            const resultado = await notificacionService.obtenerLeidas("user-1");

            expect(notificacionRepoMock.findLeidas).toHaveBeenCalledWith("user-1");
            expect(resultado).toEqual([]);
        });

        test("debería lanzar NotFoundError si el usuario no existe (repo retorna null)", async () => {
            notificacionRepoMock.findLeidas.mockResolvedValue(null);

            await expect(
                notificacionService.obtenerLeidas("user-inexistente")
            ).rejects.toThrow(NotFoundError);
        });
    });


    describe("marcarComoLeida", () => {

        test("debería retornar la notificación actualizada como leída", async () => {
            const notificacionActualizada = { _id: "notif-1", leida: true, fechaHoraLeida: new Date() };
            notificacionRepoMock.setLeida.mockResolvedValue(notificacionActualizada);

            // partimos de una notificación no leída
            const resultado = await notificacionService.marcarComoLeida("notif-1");

            expect(notificacionRepoMock.setLeida).toHaveBeenCalledWith("notif-1");
            expect(resultado.leida).toBe(true);         // fue marcada como leída
            expect(resultado.fechaHoraLeida).not.toBeNull(); // se registró la fecha
        });

        test("debería lanzar NotFoundError si la notificación no existe", async () => {
            notificacionRepoMock.setLeida.mockResolvedValue(null);

            await expect(
                notificacionService.marcarComoLeida("notif-inexistente")
            ).rejects.toThrow(NotFoundError);
        });
    });


    describe("crear", () => {

        test("debería crear una notificación con los datos correctos y retornarla", async () => {
            const notificacionPersistida = {
                _id: "notif-nuevo",
                destinatarioId: "user-2",
                remitenteId: "med-1",
                mensaje: "Su turno fue aceptado",
                leida: false,
            };
            notificacionRepoMock.createNotificacion.mockResolvedValue(notificacionPersistida);

            const resultado = await notificacionService.crear("user-2", "med-1", "Su turno fue aceptado");

            expect(notificacionRepoMock.createNotificacion).toHaveBeenCalledWith(
                expect.objectContaining({
                    destinatarioId: "user-2",
                    remitenteId: "med-1",
                    mensaje: "Su turno fue aceptado",
                    leida: false,
                })
            );
            expect(resultado).toEqual(notificacionPersistida);
        });

        test("debería crear la notificación con fechaHoraCreacion y leida=false por defecto", async () => {
            notificacionRepoMock.createNotificacion.mockImplementation(async (n) => n);

            const resultado = await notificacionService.crear("user-2", "med-1", "Recordatorio");

            expect(resultado.leida).toBe(false);
            expect(resultado.fechaHoraLeida).toBeNull();
            expect(resultado.fechaHoraCreacion).toBeInstanceOf(Date);
        });

        test("debería propagar el error si el repo falla al guardar", async () => {
            notificacionRepoMock.createNotificacion.mockRejectedValue(new Error("DB error"));

            await expect(
                notificacionService.crear("user-2", "med-1", "Turno confirmado")
            ).rejects.toThrow("DB error");
        });
    });
});