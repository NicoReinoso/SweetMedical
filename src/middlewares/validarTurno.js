import { ZodError } from "zod";
import { turnoFormato } from "../formatos/turnoFormato.js";
import { BadRequestError, UnprocessableEntityError } from "../errors/AppError.js";

export const validarTurno = (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new BadRequestError("El body no puede estar vacío");
        }

        req.body = turnoFormato.parse(req.body);

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const mensajes = error.issues.map(e => e.message).join(", ");
            return next(new UnprocessableEntityError(mensajes));
        }
        next(error);
    }
};

// Nuevos middlewares cancelar y reprogramar Turno

export const validarTurno = validarBody(turnoFormato);

export const validarCancelacion = validarBody(
    z.object({
        motivo: z.string({ required_error: "motivo es obligatorio" })
                 .min(3, "El motivo debe tener al menos 3 caracteres")
    }).strict()
);

export const validarReprogramacion = validarBody(
    z.object({
        fechaHora: z.string({ required_error: "fechaHora es obligatoria" })
            .refine(val => !isNaN(new Date(val).getTime()), {
                message: "fechaHora debe ser una fecha válida"
            })
            .refine(val => new Date(val) > new Date(), {
                message: "La nueva fecha debe ser futura"
            })
    }).strict()
);