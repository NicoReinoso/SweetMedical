import { ZodError } from "zod";
import { cancelarTurnoFormato } from "../formatos/cancelarTurnoFormato.js";
import {
    BadRequestError,
    UnprocessableEntityError
} from "../errors/AppError.js";

export const validarCancelacionTurno = (req, res, next) => {
    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            throw new BadRequestError("El body no puede estar vacío");
        }

        req.body = cancelarTurnoSchema.parse(req.body);

        next();

    } catch (error) {

        if (error instanceof ZodError) {
            const mensajes = error.issues
                .map(e => e.message)
                .join(", ");

            return next(
                new UnprocessableEntityError(mensajes)
            );
        }

        next(error);
    }
};