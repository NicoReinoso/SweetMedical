import { z } from "zod";

export const turnoFormato = z.object({
    pacienteId: z.string({
        required_error: "pacienteId es obligatorio"
    }),

    medicoId: z.string({
        required_error: "medicoId es obligatorio"
    }),

    fechaHora: z.string({
        required_error: "fechaHora es obligatorio"
    }).refine(val => !isNaN(new Date(val).getTime()), {
        message: "fechaHora debe ser una fecha válida"
    }).refine(val => {
        const fecha = new Date(val);
        return fecha > new Date();
        }, {
            message: "La fecha debe ser futura"
    }),

    sede: z.string({
        required_error: "sede es obligatoria"
    }).min(1, "sede no puede estar vacía"),

    practica: z.string({
        required_error: "practica es obligatoria"
    }).min(1, "practica no puede estar vacía"),

    costo: z.number({
        required_error: "costo es obligatorio"
    }).positive("costo debe ser mayor a 0")

}).strict();

export const cancelarTurnoFormato = z.object({
    motivo: z
        .string({
            required_error: "El motivo es obligatorio"
        })
        .trim()
        .min(1, "El motivo no puede estar vacío")
        .max(200, "El motivo es demasiado largo")
}).strict();

export const reprogramarTurnoFormato = z.object({
        fechaHora: z.string({ required_error: "fechaHora es obligatoria" })
            .refine(val => !isNaN(new Date(val).getTime()), {
                message: "fechaHora debe ser una fecha válida"
            })
            .refine(val => new Date(val) > new Date(), {
                message: "La nueva fecha debe ser futura"
            })
    }).strict();