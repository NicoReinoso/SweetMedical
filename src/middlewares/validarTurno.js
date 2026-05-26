import { ZodError } from "zod";
import { turnoFormato, cancelarTurnoFormato, reprogramarTurnoFormato, filtrosBusquedaFormato } from "../formatos/turnoFormato.js";
import { BadRequestError, UnprocessableEntityError } from "../errors/AppError.js";

export const validarFiltrosTurno = (req, res, next) => {
    try {
        const filtros = req.query;

        filtrosBusquedaFormato.parse(filtros);

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const mensajes = error.issues.map(e => e.message).join(", ");
            return next(new UnprocessableEntityError(mensajes));
        }
        next(error);
    }
}

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

export const validarCancelacion = (req, res, next) => {
    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            throw new BadRequestError("El body no puede estar vacío");
        }

        req.body = cancelarTurnoFormato.parse(req.body);

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
}

export const validarReprogramacion = (req, res, next) => {
    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            throw new BadRequestError("El body no puede estar vacío");
        }

        req.body = reprogramarTurnoFormato.parse(req.body);

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
}