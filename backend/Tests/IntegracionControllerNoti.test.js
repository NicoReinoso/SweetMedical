import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";

// En ESM, jest.mock() no hace hoisting con imports dinámicos.
// Hay que usar jest.unstable_mockModule() explícitamente antes de importar.
jest.unstable_mockModule("../src/Repositorio/notificacionBd.js", () => ({
    NotificacionRepo: jest.fn().mockImplementation(() => ({
        findNoLeidas: jest.fn(),
        findLeidas: jest.fn(),
        setLeida: jest.fn(),
        createNotificacion: jest.fn(),
    })),
}));

jest.unstable_mockModule("../src/Repositorio/pacienteBd.js", () => ({
    PacienteRepo: jest.fn().mockImplementation(() => ({})),
}));
jest.unstable_mockModule("../src/Repositorio/medicoBd.js", () => ({
    MedicoRepo: jest.fn().mockImplementation(() => ({})),
}));
jest.unstable_mockModule("../src/Repositorio/turnoBd.js", () => ({
    TurnoRepo: jest.fn().mockImplementation(() => ({})),
}));

const { notificacionController } = await import("../src/container.js");
const notificacionRoutes = (await import("../src/Routes/notificacionRoutes.js")).default;
const { errorHandler } = await import("../src/middlewares/errorHandler.js");

describe("PATCH /notificaciones/:id (integración - controller)", () => {

    let app;
    let token;

    beforeAll(() => {
        process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

        token = jwt.sign(
            { id: "user-1", rol: "paciente", nombre: "Test User" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
    });

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use("/notificaciones", notificacionRoutes);
        app.use(errorHandler);
    });

    test("debería marcar la notificación como leída y devolver 200 con el objeto actualizado", async () => {
        const notificacionActualizada = {
            _id: "notif-1",
            leida: true,
            fechaHoraLeida: new Date().toISOString(),
        };

        notificacionController.notificacionService.notificacionRepo.setLeida
            .mockResolvedValue(notificacionActualizada);

        const response = await request(app)
            .patch("/notificaciones/notif-1")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.leida).toBe(true);
        expect(notificacionController.notificacionService.notificacionRepo.setLeida)
            .toHaveBeenCalledWith("notif-1");
    });

    test("debería devolver 404 si la notificación no existe", async () => {
        notificacionController.notificacionService.notificacionRepo.setLeida
            .mockResolvedValue(null);

        const response = await request(app)
            .patch("/notificaciones/notif-inexistente")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
    });

    test("debería devolver 401 si no se envía token", async () => {
        const response = await request(app)
            .patch("/notificaciones/notif-1");

        expect(response.status).toBe(401);
    });
});