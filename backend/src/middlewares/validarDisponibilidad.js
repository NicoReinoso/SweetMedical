import { ZodError } from "zod";
import { disponibilidadFormato } from "../formatos/disponibilidadFormato.js";
import { BadRequestError, UnprocessableEntityError } from "../errors/AppError.js";

export const validarDisponibilidad = (req, res, next) => {
    try {
        // caso: body vacío
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new BadRequestError("El body no puede estar vacío");
        }

        // validación estructural
        req.body = disponibilidadFormato.parse(req.body);

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const mensajes = error.issues.map(e => e.message).join(", ");
            return next(new UnprocessableEntityError(mensajes));
        }
        next(error);
    }
};