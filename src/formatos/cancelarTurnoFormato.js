import { z } from "zod";

export const cancelarTurnoFormato = z.object({
    motivo: z
        .string({
            required_error: "El motivo es obligatorio"
        })
        .trim()
        .min(1, "El motivo no puede estar vacío")
        .max(200, "El motivo es demasiado largo")
});